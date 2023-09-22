import { Flex } from '@mantine/core'
import { useImmer } from 'use-immer'
import { v4 as uuidv4 } from "uuid"
import type { TSetQuestionItem, TSetQuestionList } from '~/components/room/Game/games/Set/set.types'
import { useConfigurator } from '~/hooks/useConfigurator'
import CreateSetContainer from './components/CreateSetContainer'
import SetList from './components/SetList'
import { generateRandomFormList } from './helpers'
import { useEffect, useState } from 'react'

const NUM_OF_CARDS = 12

const DEFAULT_SET_FORMS = Array(NUM_OF_CARDS).fill(null).map(_ => generateRandomFormList())

const SetConfigurator = () => {
    const [set, setSet, { enableFurtherButton, disableFurtherButton }] = useConfigurator("set")
    // const [cards, setCards] = useImmer<TSetListItem[]>(DEFAULT_SET_FORMS)
    const [questions, setQuestions] = useState<TSetQuestionList>([])
    const [questionItem, setQuestionItem] = useImmer<TSetQuestionItem>({
        id: uuidv4(),
        cards: DEFAULT_SET_FORMS
    })

    const addQuestion = (newQuestion: TSetQuestionItem) => {
        console.log("New question: ", newQuestion)
        setQuestions(oldQuestions => [...oldQuestions, newQuestion])
    }

    const updateQuestion = (updatedQuestion: TSetQuestionItem) => {
        console.log("Updated question: ", updatedQuestion)
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