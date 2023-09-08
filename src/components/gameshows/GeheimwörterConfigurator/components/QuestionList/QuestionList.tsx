import { Flex, Title } from '@mantine/core'
import React from 'react'
import type { IQuestionListProps } from './questionList.types'
import type { TGeheimwoerterQuestionItem } from '~/components/room/Game/games/Geheimwörter/geheimwörter.types'
import List from '~/components/shared/List/List'

const QuestionItem = ({ question }: { question: TGeheimwoerterQuestionItem }) => {
    return <div>{question.answer}</div>
}

const QuestionList: React.FC<IQuestionListProps> = ({ questions }) => {
    console.log("Questions: ", questions)
    return (
        <Flex direction="column" gap="lg" w="100%">
            <Title order={3}>Antworten</Title>
            <List data={questions.map(q => q.answer)} />

            {/* {questions.map(q => (
                    <QuestionItem question={q} />
                ))} */}
        </Flex>
    )
}

export default QuestionList