import { Flex } from '@mantine/core'
import React from 'react'
import type { IQuestionListProps } from './questionList.types'

const QuestionList: React.FC<IQuestionListProps> = ({ questions }) => {
    console.log("Qs: ", questions)
    return (
        <Flex w="100%">QuestionList</Flex>
    )
}

export default QuestionList