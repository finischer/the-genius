import { Flex, Title } from "@mantine/core"
import List from "~/components/shared/List"
import type { ISetListProps } from "./setList.typtes"

const SetList: React.FC<ISetListProps> = ({ questions, setQuestions }) => {
    return (
        <Flex direction="column" gap="lg" w="50%">
            <Title order={3}>Alle Sets</Title>
            <List data={questions} setData={setQuestions} editable />
        </Flex>
    )
}

export default SetList