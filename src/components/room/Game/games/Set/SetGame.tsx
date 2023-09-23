import React from 'react'
import type { ISetGameProps } from './set.types'
import { Flex, SimpleGrid, Text } from '@mantine/core'
import SetCard from './components/SetCard'
import { findSets } from '~/components/gameshows/SetConfigurator/helpers'
import { useUser } from '~/hooks/useUser'

const SetGame: React.FC<ISetGameProps> = ({ game }) => {
    const { isHost } = useUser()
    const currQuestion = game.questions[game.qIndex]
    const possibleSets = findSets(currQuestion?.cards ?? [])

    return (
        <Flex direction="column" gap="xl">
            <SimpleGrid cols={3}>
                {currQuestion?.cards.map((card, idx) => <SetCard key={card.id} card={card} index={idx} isFlipped />)}
            </SimpleGrid>

            {isHost &&
                <Flex direction="column" align="center">
                    <Text color="dimmed">Mögliche Sets</Text>
                    {possibleSets.length === 0 && "Mit diesem Stapel ist kein Set möglich"}
                    {possibleSets.map((s, idx) => {
                        const cardNumbers = s.map(s => s + 1);

                        return <Flex>
                            Set {idx + 1}: {cardNumbers.join(",")}
                        </Flex>

                    })}
                </Flex>
            }
        </Flex>
    )
}

export default SetGame