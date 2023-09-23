import { Flex, Title } from "@mantine/core"
import List from "~/components/shared/List"
import type { ISetListProps } from "./setList.typtes"
import type { IListItem } from "~/components/shared/List/components/ListItem/listItem.types"
import type { TSetQuestionItem } from "~/components/room/Game/games/Set/set.types"

const SetList: React.FC<ISetListProps> = ({ questions, setQuestions, setQuestionItem, questionItem }) => {
    const selectedItemId = questionItem.id

    const handleItemClick = (item: IListItem) => {
        const question = item as TSetQuestionItem
        setQuestionItem(question)
    }

    return (
        <Flex direction="column" gap="lg" w="50%">
            <Title order={3}>Alle Sets ({questions.length})</Title>
            <List
                data={questions}
                onClickItem={handleItemClick}
                setData={setQuestions}
                editable
                selectedItemId={selectedItemId}
            />
        </Flex>
    )
}

export default SetList