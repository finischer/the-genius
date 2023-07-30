import React from 'react'
import { type IMemoryGameProps } from './memory.types'

const MemoryGame: React.FC<IMemoryGameProps> = ({ game }) => {
    return (
        <div>{game.name}</div>
    )
}

export default MemoryGame