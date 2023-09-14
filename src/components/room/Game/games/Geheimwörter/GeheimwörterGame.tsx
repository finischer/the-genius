import { Flex, useMantineTheme } from '@mantine/core'
import React from 'react'
import CodeList from '~/components/gameshows/GeheimwörterConfigurator/components/CodeList'
import AnswerBanner from '~/components/room/AnswerBanner'
import type { IGeheimwörterGameProps } from './geheimwörter.types'

const GeheimwörterGame: React.FC<IGeheimwörterGameProps> = ({ game }) => {
    const theme = useMantineTheme()
    const question = game.questions[game.qIndex]
    const showAnswer = game.display.answer

    if (!question) return <></>

    return (
        <Flex align="center" gap="5rem">
            <CodeList codeList={game.codeList} showTitle={false} />

            <Flex direction="column" gap="md" w={showAnswer ? "100%" : "auto"}>
                <Flex direction="column" bg={theme.primaryColor} p="md" sx={{ borderRadius: theme.radius.md }}>
                    {question.words.map(word => (
                        <Flex>
                            <Flex w="100%">
                                <span style={{ fontWeight: "bold" }}>{word.word}</span>
                            </Flex>

                            {showAnswer &&
                                <Flex w="100%">
                                    <span>
                                        <span style={{ fontWeight: "bold" }}>{word.category[0]}</span>
                                        <span>{word.category.slice(1)}</span>
                                    </span>
                                </Flex>
                            }
                        </Flex>
                    ))}
                </Flex>

                <AnswerBanner
                    answer={question.answer}
                    showAnswer={showAnswer}
                    miw={0}
                />
            </Flex>

        </Flex>
    )
}

export default GeheimwörterGame