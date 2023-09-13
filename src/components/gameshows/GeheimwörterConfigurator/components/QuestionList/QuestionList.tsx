import { Flex, Title } from '@mantine/core'
import React from 'react'
import type { TGeheimwoerterQuestionItem } from '~/components/room/Game/games/Geheimwörter/geheimwörter.types'
import List from '~/components/shared/List'
import type { IQuestionListProps } from './questionList.types'
import type { IListItem } from '~/components/shared/List/components/ListItem/listItem.types'


const QuestionList: React.FC<IQuestionListProps> = ({ questions, setQuestions, setQuestionItem, questionItem }) => {
    const keyForRendering: keyof TGeheimwoerterQuestionItem = "answer"

    const handleItemClick = (item: IListItem) => {
        const question = item as TGeheimwoerterQuestionItem
        setQuestionItem(question)
    }

    return (
        <Flex direction="column" gap="lg" w="100%">
            <Title order={3}>Antworten ({questions.length})</Title>
            <List data={questions} setData={setQuestions} onClickItem={handleItemClick} renderValueByKey={keyForRendering} editable />
        </Flex>
    )
}

export default QuestionList