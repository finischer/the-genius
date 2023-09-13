import { Button, Flex, Text, TextInput, Title } from '@mantine/core'
import React, { useEffect, type FormEvent, type FormEventHandler, useRef } from 'react'
import type { ICreateQuestionContainerProps, IWordItemProps } from './createQuestionForm.types'
import { v4 as uuidv4 } from 'uuid';
import { useForm } from '@mantine/form';

const WordItem: React.FC<IWordItemProps> = ({ word, ...props }) => {
    return <Flex gap="md">
        <TextInput value={word?.word ?? ""} placeholder='Wort eingeben ...' {...props} />
        <span>{word?.category}</span>
    </Flex>
}

const CreateQuestionForm: React.FC<ICreateQuestionContainerProps> = ({ codeList, onAddQuestion, onUpdateQuestion, question, setQuestion, mode }) => {
    const inputRef = useRef<HTMLInputElement | null>(null)

    const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuestion(draft => {
            const newAnswer = e.target.value
            draft.answer = newAnswer

            const splittedAnswer = newAnswer.split("")

            // add new word for every new char in answer
            draft.words = splittedAnswer.map((_, index) => ({
                word: question.words[index]?.word ?? "",
                category: getCategory(newAnswer[index])
            }))

        })
    }

    const handleWordsChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newWord = e.target.value
        const currCategory = question.words[index]?.category ?? ""

        setQuestion(draft => {
            draft.words[index] = {
                category: currCategory,
                word: newWord,
            }
        })
    }

    const handleSubmitQuestion = (e: React.SyntheticEvent) => {
        e.preventDefault()

        if (mode === "ADD") {
            onAddQuestion(question)
        } else if (mode === "UPDATE") {
            onUpdateQuestion(question)
        }

        setQuestion({
            id: uuidv4(),
            answer: "",
            words: []
        })

        inputRef.current?.focus()
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
        setQuestion(draft => {
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
            <form onSubmit={handleSubmitQuestion}>
                <Flex direction="column" gap="md" px="md" sx={theme => ({
                    borderRadius: theme.radius.md
                })}>
                    <TextInput ref={inputRef} required label="Antwort" onChange={handleAnswerChange} placeholder='Antwort eingeben ...' value={question.answer} />
                    {question.answer &&
                        <Flex direction="column" gap="sm">
                            <Text size="sm">Wörter</Text>
                            {question.words.map((_, index) => {
                                const word = question.words[index]
                                return <WordItem required key={index} word={word} onChange={(e) => handleWordsChange(e, index)} />
                            }
                            )}
                        </Flex>
                    }

                    <Button type="submit">{mode === "ADD" ? "Hinzufügen" : "Speichern"}</Button>
                </Flex>
            </form>
        </Flex>
    )
}

export default CreateQuestionForm