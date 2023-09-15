import { Box, Button, Flex, SimpleGrid, useMantineTheme } from '@mantine/core'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import CodeList from '~/components/gameshows/GeheimwörterConfigurator/components/CodeList'
import AnswerBanner from '~/components/room/AnswerBanner'
import ActionIcon from '~/components/shared/ActionIcon'
import { useSocket } from '~/hooks/useSocket'
import { useUser } from '~/hooks/useUser'
import { animations } from '~/utils/animations'
import type { IGeheimwörterGameProps } from './geheimwörter.types'
import ArrowActionButton from '~/components/shared/ArrowActionButton'

const GeheimwörterGame: React.FC<IGeheimwörterGameProps> = ({ game }) => {
    const theme = useMantineTheme()
    const question = game.questions[game.qIndex]
    const showAnswer = game.display.answer
    const showWords = game.display.words
    const { isHost } = useUser()
    const { socket } = useSocket()

    const ToggleIcon = ({ action }: { action: keyof typeof game.display }) => {
        if (game.display[action]) {
            return <IconEyeOff size={32} />
        }

        return <IconEye size={32} />
    }

    const toggleCodeList = () => {
        socket.emit("geheimwoerter:toggleCodeList")
    }

    const toggleWords = () => {
        socket.emit("geheimwoerter:toggleWords")
    }

    const handleShowAnswer = () => {
        socket.emit("geheimwoerter:showAnswer")
    }

    const handleNextQuestion = () => {
        socket.emit("geheimwoerter:nextQuestion")
    }

    const handlePrevQuestion = () => {
        socket.emit("geheimwoerter:prevQuestion")
    }


    if (!question) return <></>

    const WordList = () => (
        <Flex direction="column" gap="md">
            {isHost &&
                <ActionIcon
                    onClick={toggleWords}
                    size={32}
                    toolTip={`Wörter ${showWords ? "ausblenden" : "einblenden"}`}
                >
                    <ToggleIcon action='words' />
                </ActionIcon>
            }
            <Flex direction="column" bg={theme.primaryColor} p="md" sx={{ borderRadius: theme.radius.md }} opacity={showWords ? 1 : 0.4}>
                <SimpleGrid cols={showAnswer ? 2 : 1} verticalSpacing={0} spacing="md">
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
        </Flex>
    )

    const ShowAnswerButton = () => {
        if (showAnswer || !isHost) return <></>

        return (
            <Button
                variant='default'
                onClick={handleShowAnswer}
                disabled={!showWords}
            >
                Antwort anzeigen
            </Button>
        )
    }

    return (
        <Flex align="center" gap="5rem" justify="center">
            <SimpleGrid cols={2} sx={{ display: "flex", alignItems: "center" }} w={900} spacing="5rem">
                <AnimatePresence>
                    {(game.display.codeList || isHost) &&
                        <Flex direction="column" gap="sm" w="50%">
                            {isHost &&
                                <ActionIcon
                                    onClick={toggleCodeList}
                                    size={32}
                                    toolTip={`Codelist ${game.display.codeList ? "ausblenden" : "einblenden"}`}
                                >
                                    <ToggleIcon action="codeList" />
                                </ActionIcon>
                            }
                            <Box opacity={game.display.codeList ? 1 : 0.4}>
                                <CodeList codeList={game.codeList} showTitle={false} />
                            </Box>
                        </Flex>
                    }
                </AnimatePresence>

                <AnimatePresence>
                    {(showWords || isHost) &&
                        <Flex direction="column" w="auto">
                            <motion.div {...animations.fadeInOut} style={{ display: "flex", gap: "1rem", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                <Flex gap="md" justify="center" align="center">
                                    <WordList />
                                </Flex>
                                <Flex align="center" gap="md">
                                    {isHost &&
                                        <ArrowActionButton
                                            arrowDirection='left'
                                            onClick={handlePrevQuestion}
                                            tooltip='Vorherige Frage'
                                            disabled={game.qIndex <= 0}
                                        />
                                    }
                                    {!showAnswer ?
                                        <ShowAnswerButton /> :
                                        <AnswerBanner
                                            answer={question.answer}
                                            showAnswer={showWords && showAnswer}
                                            miw={0}
                                        />
                                    }
                                    {isHost &&
                                        <ArrowActionButton
                                            arrowDirection='right'
                                            onClick={handleNextQuestion}
                                            tooltip='Nächste Frage'
                                            disabled={game.qIndex >= game.questions.length - 1}
                                        />
                                    }
                                </Flex>
                            </motion.div>


                        </Flex>
                    }
                </AnimatePresence >


            </SimpleGrid>
        </Flex >
    )
}

export default GeheimwörterGame