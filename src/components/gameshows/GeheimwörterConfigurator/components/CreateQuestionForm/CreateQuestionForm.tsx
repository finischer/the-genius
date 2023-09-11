import { Button, Flex, Text, TextInput, Title } from '@mantine/core'
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import type { TGeheimwoerterQuestionItem } from '~/components/room/Game/games/Geheimwörter/geheimwörter.types'
import type { ICreateQuestionContainerProps, IWordItemProps } from './createQuestionForm.types'
import { v4 as uuidv4 } from 'uuid';

const WordItem: React.FC<IWordItemProps> = ({ word, ...props }) => {
    return <Flex gap="md">
        <TextInput value={word?.word ?? ""} placeholder='Wort eingeben ...' {...props} />
        <span>{word?.category}</span>
    </Flex>
}

const CreateQuestionForm: React.FC<ICreateQuestionContainerProps> = ({ codeList, onAddQuestion }) => {
    const [questionItem, setQuestionItem] = useImmer<TGeheimwoerterQuestionItem>({
        id: uuidv4(),
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

    const handleAddQuestion = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault()
        onAddQuestion(questionItem)
        setQuestionItem({
            id: uuidv4(),
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
            <form>
                <Flex direction="column" gap="md" px="md" sx={theme => ({
                    borderRadius: theme.radius.md
                })}>
                    <TextInput required label="Antwort" onChange={handleAnswerChange} placeholder='Antwort eingeben ...' value={questionItem.answer} />
                    {questionItem.answer &&
                        <Flex direction="column" gap="sm">
                            <Text size="sm">Wörter</Text>
                            {questionItem.words.map((_, index) => {
                                const word = questionItem.words[index]
                                // TODO: Make WordItem required for form -> it does not work yet
                                return <WordItem required key={index} word={word} onChange={(e) => handleWordsChange(e, index)} />
                            }
                            )}
                        </Flex>
                    }

                    <Button onClick={handleAddQuestion} type="submit">Hinzufügen</Button>
                </Flex>
            </form>
        </Flex>
    )
}

export default CreateQuestionForm