import { Flex, Title } from '@mantine/core'
import React from 'react'
import List from '~/components/shared/List'
import type { IQuestionListProps } from './questionList.types'

const QuestionList: React.FC<IQuestionListProps> = ({ questions }) => {
    return (
        <Flex direction="column" gap="lg" w="100%">
            <Title order={3}>Antworten</Title>
            <List data={questions.map(q => q.answer)} />
        </Flex>
    )
}

export default QuestionList