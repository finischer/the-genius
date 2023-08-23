import { useCallback, useEffect, useState } from 'react'
import { useRoom } from '../useRoom'
import { socket } from '../useSocket'
import { useUser } from '../useUser'

const useBuzzer = () => {
    const [isActive, setIsActive] = useState(true)
    const { isPlayer, team } = useUser()
    const { room } = useRoom()

    useEffect(() => {
        function handleBuzzerEvent(e: KeyboardEvent) {
            // only listen to space
            if (e.code === "Space") {
                handleBuzzerClick()
            }
        }

        // remove listener when buzzer is not active -> important!
        if (!isActive) {
            window.removeEventListener("keydown", handleBuzzerEvent)
        }

        // only add listener when user is a player
        if (isPlayer) {
            window.addEventListener("keydown", handleBuzzerEvent)
        }

        return () => {
            window.removeEventListener("keydown", handleBuzzerEvent)
        }
    }, [isPlayer, isActive])

    const deactivateBuzzer = () => {
        setIsActive(false)
    }

    const activateBuzzer = () => {
        setIsActive(true)
    }

    const handleBuzzerClick = () => {
        if (!isPlayer || room.state.teamWithTurn || !team || !isActive) return
        socket.emit("buzzer", ({ teamId: team.id, withTimer: true }))
    }



    return { isActive, buzzer: handleBuzzerClick, activateBuzzer, deactivateBuzzer }
}

export default useBuzzer