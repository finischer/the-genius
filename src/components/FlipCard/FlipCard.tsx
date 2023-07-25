import React from 'react'
import { IFlipCardProps } from './flipcard.types'

const FlipCard: React.FC<IFlipCardProps> = ({ front, back, onClick, clickable = true }) => {
    return (
        <div>FlipCard</div>
    )
}

export default FlipCard