import { Container, Flex, SimpleGrid, useMantineTheme } from '@mantine/core'
import React from 'react'
import CodeList from '~/components/gameshows/GeheimwörterConfigurator/components/CodeList'
import AnswerBanner from '~/components/room/AnswerBanner'
import type { IGeheimwörterGameProps } from './geheimwörter.types'
import { AnimatePresence } from 'framer-motion'

const GeheimwörterGame: React.FC<IGeheimwörterGameProps> = ({ game }) => {
    const theme = useMantineTheme()
    const question = game.questions[game.qIndex]
    const showAnswer = !game.display.answer

    if (!question) return <></>

    return (
        <Flex align="center" gap="5rem">
            <AnimatePresence>
                {!game.display.codeList &&
                    <CodeList codeList={game.codeList} showTitle={false} />
                }
            </AnimatePresence>

            {!game.display.words &&
                <Flex direction="column" gap="md" w="auto">
                    <Flex direction="column" bg={theme.primaryColor} p="md" sx={{ borderRadius: theme.radius.md }}>
                        <SimpleGrid cols={2} verticalSpacing={0} spacing={0}>
                            {question.words.map(word => (
                                <>
                                    <span style={{ fontWeight: "bold" }}>{word.word}</span>
                                    {showAnswer &&
                                        <span>
                                            <span style={{ fontWeight: "bold" }}>{word.category[0]}</span>
                                            <span>{word.category.slice(1)}</span>
                                        </span>
                                    }
                                </>
                            ))}
                        </SimpleGrid>
                    </Flex>

                    <AnswerBanner
                        answer={question.answer}
                        showAnswer={showAnswer}
                        miw={0}
                    />


                </Flex >
            }

        </Flex >
    )
}

export default GeheimwörterGame