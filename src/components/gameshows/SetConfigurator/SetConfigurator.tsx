import { Flex } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useImmer } from 'use-immer'
import type { TSetQuestionItem, TSetQuestionList } from '~/components/room/Game/games/Set/set.types'
import { useConfigurator } from '~/hooks/useConfigurator'
import type { TQuestionFormMode } from '../types'
import CreateSetContainer from './components/CreateSetContainer'
import SetList from './components/SetList'
import { generateNewSetQuestion } from './helpers'

export const NUM_OF_CARDS = 12

const SetConfigurator = () => {
    const [set, setSet, { enableFurtherButton, disableFurtherButton }] = useConfigurator("set")

    const [questions, setQuestions] = useState<TSetQuestionList>(set.questions)
    const [questionItem, setQuestionItem] = useImmer<TSetQuestionItem>(questions.at(0) ?? generateNewSetQuestion(NUM_OF_CARDS))
    const questionFormMode: TQuestionFormMode = questions.map(i => i.id).includes(questionItem.id) ? "UPDATE" : "ADD"


    const addQuestion = (newQuestion: TSetQuestionItem) => {
        setQuestions(oldQuestions => [...oldQuestions, newQuestion])
    }

    const updateQuestion = (updatedQuestion: TSetQuestionItem) => {
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

        if (questions.length <= 0) {
            disableFurtherButton()
        } else {
            enableFurtherButton()
        }

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