import { Flex, Title } from '@mantine/core'
import React from 'react'
import type { TGeheimwoerterQuestionItem } from '~/components/room/Game/games/Geheimwörter/geheimwörter.types'
import List from '~/components/shared/List'
import type { IQuestionListProps } from './questionList.types'


const QuestionList: React.FC<IQuestionListProps> = ({ questions, setQuestions }) => {
    const keyForRendering: keyof TGeheimwoerterQuestionItem = "answer"

    return (
        <Flex direction="column" gap="lg" w="100%">
            <Title order={3}>Antworten</Title>
            <List data={questions} setData={setQuestions} renderValueByKey={keyForRendering} canReorder />
        </Flex>
    )
}

export default QuestionList