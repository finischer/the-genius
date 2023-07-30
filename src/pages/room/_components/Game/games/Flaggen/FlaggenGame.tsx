import React from 'react'
import { type IFlaggenGameProps } from './flaggen.types'

const FlaggenGame: React.FC<IFlaggenGameProps> = ({ game }) => {
    return (
        <div>{game.name}</div>
    )
}

export default FlaggenGame