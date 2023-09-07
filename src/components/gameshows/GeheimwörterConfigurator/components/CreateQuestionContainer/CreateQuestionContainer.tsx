import { Button, Flex, Text, TextInput, Title } from '@mantine/core'
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import type { TGeheimwoerterQuestionItem } from '~/components/room/Game/games/Geheimwörter/geheimwörter.types'
import type { ICreateQuestionContainerProps, IWordItemProps } from './createQuestionContainer.types'

const WordItem: React.FC<IWordItemProps> = ({ word, ...props }) => {
    return <Flex gap="md">
        <TextInput value={word?.word ?? ""} placeholder='Wort eingeben ...' {...props} />
        <span>{word?.category}</span>
    </Flex>
}

const CreateQuestionContainer: React.FC<ICreateQuestionContainerProps> = ({ codeList, onAddQuestion }) => {
    const [questionItem, setQuestionItem] = useImmer<TGeheimwoerterQuestionItem>({
        answer: "",
        words: []
    })

    const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuestionItem(draft => {
            const newAnswer = e.target.value
            draft.answer = newAnswer

            const splittedAnswer = newAnswer.split("")

            // add new word for every new char in answer
            draft.words = splittedAnswer.map((_, index) => ({
                word: questionItem.words[index]?.word ?? "",
                category: getCategory(newAnswer[index])
            }))

        })
    }

    const handleWordsChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newWord = e.target.value
        const currCategory = questionItem.words[index]?.category ?? ""

        setQuestionItem(draft => {
            draft.words[index] = {
                category: currCategory,
                word: newWord,
            }
        })
    }

    const handleAddQuestion = () => {
        onAddQuestion(questionItem)
        setQuestionItem({
            answer: "",
            words: []
        })
    }

    const getCategory = (letter: string | undefined) => {
        if (!letter) return ""

        const letterLower = letter.toLowerCase()

        for (const code of codeList) {
            if (code.letter.toLowerCase() === letterLower) {
                return code.category
            }
        }

        return ""
    }

    useEffect(() => {
        setQuestionItem(draft => {
            draft.words = draft.words.map((word, index) => {
                const splittedAnswer = draft.answer.split("")
                return {
                    ...word,
                    category: getCategory(splittedAnswer[index])
                }
            })
        })
    }, [codeList])


    return (
        <Flex direction="column" gap="lg" w="100%">
            <Title order={3} >Antwort erstellen</Title>
            <Flex direction="column" gap="md" px="md" sx={theme => ({
                borderRadius: theme.radius.md
            })}>
                <TextInput label="Antwort" onChange={handleAnswerChange} placeholder='Antwort eingeben ...' value={questionItem.answer} />
                {questionItem.answer &&
                    <Flex direction="column" gap="sm">
                        <Text size="sm">Wörter</Text>
                        {questionItem.words.map((_, index) => {
                            const word = questionItem.words[index]
                            return <WordItem key={index} word={word} onChange={(e) => handleWordsChange(e, index)} />
                        }
                        )}
                    </Flex>
                }

                <Button onClick={handleAddQuestion}>Hinzufügen</Button>
            </Flex>
        </Flex>
    )
}

export default CreateQuestionContainer