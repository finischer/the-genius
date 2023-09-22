import { Button, Flex, SimpleGrid, Title } from "@mantine/core"
import SetCard from "~/components/room/Game/games/Set/components/SetCard"
import type { ICreateSetContainerProps } from "./createSetContainer.types"
import type { TSetQuestionItem } from "~/components/room/Game/games/Set/set.types"

const CreateSetContainer: React.FC<ICreateSetContainerProps> = ({ question, setQuestion, onAddQuestion }) => {

    const cardElements = question.cards.map((item, index) => <SetCard isFlipped key={index} editable card={item} setCards={setQuestion} index={index} />)

    const handleAddQuestion = (newQuestion: TSetQuestionItem) => {

    }

    return (
        <Flex direction="column" gap="lg" w="100%" justify="center" align="center" >
            <Title order={3}>Set erstellen</Title>

            <SimpleGrid cols={3} spacing="md" verticalSpacing="md">
                {cardElements}
            </SimpleGrid>

            <Button.Group>
                <Button variant='default'>Ausfüllen</Button>
                <Button onClick={() => handleAddQuestion(question)}>Set Hinzufügen</Button>
            </Button.Group>
        </Flex>
    )
}

export default CreateSetContainer