import React from 'react'
import FlaggenGame from './flaggen'
import MerkenGame from './merken'
import MemoryGame from './memory'
import { type IGameProps, type TGameNames, type TGameMap } from './game.types'
import { type TFlaggenGameState } from './flaggen/config'
import { type TMerkenGameState } from './merken/config'
import { type TMemoryGameState } from './memory/config'


// Wrapper for the games
// Handles also the intro sequence
const Game: React.FC<IGameProps> = ({ game }) => {

    function getGame(identifier: TGameNames) {
        const GAME_MAP: TGameMap = {
            flaggen: <FlaggenGame game={game as TFlaggenGameState} />,
            merken: <MerkenGame game={game as TMerkenGameState} />,
            memory: <MemoryGame game={game as TMemoryGameState} />
        }

        return GAME_MAP[identifier]
    }

    return (
        <>
            {getGame(game.identifier)}
        </>
    )
}

export default Game