import React from 'react'
import type { IGeheimwörterGameProps } from './geheimwörter.types'
import { Flex, useMantineTheme } from '@mantine/core'
import CodeList from '~/components/gameshows/GeheimwörterConfigurator/components/CodeList'

const GeheimwörterGame: React.FC<IGeheimwörterGameProps> = ({ game }) => {
    const theme = useMantineTheme()

    return (
        <Flex align="center" gap="5rem">
            <CodeList codeList={game.codeList} showTitle={false} />

            <Flex direction="column" bg={theme.primaryColor} p="md" sx={{ borderRadius: theme.radius.md }}>
                {game.questions[game.qIndex]?.words.map(word => (
                    <Flex gap="md">
                        <span>{word.word}</span>
                        <span>-</span>
                        <span>{word.category}</span>
                    </Flex>
                ))}
            </Flex>
        </Flex>
    )
}

export default GeheimwörterGame