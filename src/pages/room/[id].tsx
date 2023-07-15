import { Room } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { socket } from '~/hooks/useSocket'

const RoomPage = () => {
    const router = useRouter()
    const { data: session } = useSession();

    const roomId = router.query.id as string

    useEffect(() => {
        console.log("Use effect: ", session)
        if (session?.user) {
            console.log("Session available")
            console.log("Socket: ", socket)
            socket.emit("joinRoom", { user: session?.user, roomId }, (room: Room) => {
                console.log("Room: ", room)
            })
        }
    }, [session])

    return (
        <div>RoomPage</div>
    )
}

export default RoomPage