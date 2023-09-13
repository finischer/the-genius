import React from 'react'
import type { IGeheimwörterGameProps } from './geheimwörter.types'
import { Container, Flex, useMantineTheme } from '@mantine/core'
import CodeList from '~/components/gameshows/GeheimwörterConfigurator/components/CodeList'

const GeheimwörterGame: React.FC<IGeheimwörterGameProps> = ({ game }) => {
    const theme = useMantineTheme()

    const question = game.questions[game.qIndex]

    return (
        <Flex align="center" gap="5rem">
            <CodeList codeList={game.codeList} showTitle={false} />

            <Flex direction="column" gap="md" w="100%">

                <Flex direction="column" bg={theme.primaryColor} p="md" sx={{ borderRadius: theme.radius.md }}>
                    {question?.words.map(word => (
                        <Flex >
                            <Flex w="100%">
                                <span style={{ fontWeight: "bold" }}>{word.word}</span>
                            </Flex>

                            <Flex w="100%">
                                <span>
                                    <span style={{ fontWeight: "bold" }}>{word.category[0]}</span>
                                    <span>{word.category.slice(1)}</span>
                                </span>
                            </Flex>
                        </Flex>
                    ))}
                </Flex>

                <Container bg="white" sx={{ color: "black", borderRadius: theme.radius.xl, textAlign: "center", fontWeight: "bold", textTransform: "uppercase" }} px="xl" py="xs" w="100%" >{question?.answer}</Container>
            </Flex>

        </Flex>
    )
}

export default GeheimwörterGame