import { Flex } from '@mantine/core'
import { useImmer } from 'use-immer'
import { v4 as uuidv4 } from "uuid"
import type { TSetQuestionItem, TSetQuestionList } from '~/components/room/Game/games/Set/set.types'
import { useConfigurator } from '~/hooks/useConfigurator'
import CreateSetContainer from './components/CreateSetContainer'
import SetList from './components/SetList'
import { generateNewSetQuestion, generateRandomFormList } from './helpers'
import { useEffect, useState } from 'react'
import type { TQuestionFormMode } from '../types'

export const NUM_OF_CARDS = 12

const SetConfigurator = () => {
    const [set, setSet, { enableFurtherButton, disableFurtherButton }] = useConfigurator("set")
    // const [cards, setCards] = useImmer<TSetListItem[]>(DEFAULT_SET_FORMS)
    const [questions, setQuestions] = useState<TSetQuestionList>([])
    const [questionItem, setQuestionItem] = useImmer<TSetQuestionItem>(generateNewSetQuestion(NUM_OF_CARDS))
    const questionFormMode: TQuestionFormMode = questions.map(i => i.id).includes(questionItem.id) ? "UPDATE" : "ADD"


    const addQuestion = (newQuestion: TSetQuestionItem) => {
        console.log("New question: ", newQuestion)
        setQuestions(oldQuestions => [...oldQuestions, newQuestion])
    }

    const updateQuestion = (updatedQuestion: TSetQuestionItem) => {
        console.log("Updated question: ", updatedQuestion)
        setQuestions(oldQuestions => {
            const index = oldQuestions.findIndex(q => q.id === updatedQuestion.id)
            let newQuestions = [...oldQuestions]

            newQuestions[index] = updatedQuestion

            return newQuestions
        })
    }

    useEffect(() => {
        setSet(draft => {
            draft.set.questions = questions
        })
    }, [questions])

    return (
        <Flex>
            <CreateSetContainer
                onAddQuestion={addQuestion}
                onUpdateQuestion={updateQuestion}
                question={questionItem}
                setQuestion={setQuestionItem}
                mode={questionFormMode}
            />
            <SetList
                questions={questions}
                setQuestions={setQuestions}
                questionItem={questionItem}
                setQuestionItem={setQuestionItem}
            />
        </Flex>
    )
}

export default SetConfigurator