import { Flex, keyframes } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import FlipCard from '~/components/FlipCard/FlipCard'
import { useRoom } from '~/hooks/useRoom'
import { zoomInAnimation, zoomOutAnimation } from '~/utils/animations'
import FlaggenGame from './flaggen'
import { type TFlaggenGameState } from './flaggen/config'
import { type IGameProps, type TGameMap, type TGameNames } from './game.types'
import MemoryGame from './memory'
import { type TMemoryGameState } from './memory/config'
import MerkenGame from './merken'
import { type TMerkenGameState } from './merken/config'

const scaleAnimation = keyframes({
    "0%": { transform: "scale(1,1)" },
    "100%": { transform: "scale(1.4,1.4)" }
})

// Wrapper for the games
// Handles also the intro sequence
const Game: React.FC<IGameProps> = ({ game }) => {
    const { room } = useRoom()

    const introState = room.state.display.gameIntro
    const showGame = room.state.display.game
    const gameNumber = room.games.findIndex(g => g.identifier === game.identifier) + 1

    const [mountIntroContainer, setMountIntroContainer] = useState(true)

    function getGame(identifier: TGameNames) {
        const GAME_MAP: TGameMap = {
            flaggen: <FlaggenGame game={game as TFlaggenGameState} />,
            merken: <MerkenGame game={game as TMerkenGameState} />,
            memory: <MemoryGame game={game as TMemoryGameState} />
        }

        return GAME_MAP[identifier]
    }

    useEffect(() => {
        if (introState.alreadyPlayed && !showGame) {
            setTimeout(() => {
                setMountIntroContainer(false)
            }, 1000)
        } else if (showGame) {
            setMountIntroContainer(false)
        } else {
            setMountIntroContainer(true)
        }
    }, [introState.alreadyPlayed, showGame])



    return (
        <>
            {showGame && getGame(game.identifier)}
            {mountIntroContainer &&
                <Flex
                    direction="column"
                    gap="lg"
                    justify="center"
                    align="center"
                    sx={{
                        animation: `${zoomInAnimation} 2s, ${zoomOutAnimation} 500ms 8s, ${scaleAnimation} 6s 2s`,
                        opacity: introState.alreadyPlayed ? 0 : 1
                    }}

                >
                    <FlipCard isFlipped={introState.flippedTitleBanner} front={`Spiel ${gameNumber}`} back={game.name} />
                </Flex>
            }
        </>
    )
}

export default Game