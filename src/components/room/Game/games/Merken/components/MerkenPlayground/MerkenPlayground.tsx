import { SimpleGrid, Text, type Sx } from '@mantine/core'
import React from 'react'
import FlipCard from '~/components/shared/FlipCard/FlipCard'
import { socket } from '~/hooks/useSocket'
import { shuffleArray } from '~/utils/array'
import type { IMerkenPlaygroundProps } from './merkenPlayground.types'
import { useUser } from '~/hooks/useUser'

const MerkenPlayground: React.FC<IMerkenPlaygroundProps> = ({ cards, openCards = [], allCardsFlipped = false }) => {
    const { isHost } = useUser()

    const defaultCardStyle: Sx = {
        height: "5rem",
        width: "5rem",
        backgroundColor: "whitesmoke",
        color: "black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        userSelect: "none",
    }

    const handleFlipCard = (index: number) => {
        console.log("Click card: ", index)
        socket.emit("merken:flipCard", { cardIndex: index })
    }

    const FrontContent = ({ content }: { content: number }) => {
        return (
            <Text size="1.5rem">{content}</Text>
        )
    }

    const BackContent = ({ content, index }: { content: any, index: number }) => {
        return (
            <div>
                <span
                    style={{
                        position: "absolute",
                        top: "0.25rem",
                        left: "0.5rem",
                        fontSize: "1rem",
                        fontWeight: "500",
                        opacity: 0.7,
                    }}
                >
                    {index + 1}
                </span>
                <Text>{content}</Text>
            </div>
        )
    }

    return (
        <SimpleGrid cols={6}>
            {cards.map((elem, idx) => (
                <FlipCard
                    key={idx}
                    isFlipped={allCardsFlipped || openCards.includes(idx)}
                    clickable={isHost}
                    onClick={() => handleFlipCard(idx)}
                    front={<FrontContent content={idx + 1} />}
                    back={<BackContent index={idx} content={elem} />}
                    frontStyle={{
                        ...defaultCardStyle
                    }}
                    backStyle={{
                        ...defaultCardStyle
                    }}
                />
            ))}
        </SimpleGrid>
    )

}

export default MerkenPlayground