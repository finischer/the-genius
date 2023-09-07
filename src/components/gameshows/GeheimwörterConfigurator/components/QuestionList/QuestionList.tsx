import { Flex, Title } from '@mantine/core'
import React from 'react'
import type { IQuestionListProps } from './questionList.types'
import type { TGeheimwoerterQuestionItem } from '~/components/room/Game/games/Geheimwörter/geheimwörter.types'

const QuestionItem = ({ question }: { question: TGeheimwoerterQuestionItem }) => {
    return <div>{question.answer}</div>
}

const QuestionList: React.FC<IQuestionListProps> = ({ questions }) => {
    return (
        <Flex direction="column" gap="lg" w="100%">
            <Title order={3}>Antworten</Title>
            <Flex direction="column">
                {questions.map(q => (
                    <QuestionItem question={q} />
                ))}
            </Flex>
        </Flex>
    )
}

export default QuestionList