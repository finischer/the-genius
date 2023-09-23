import { Button, Flex, SimpleGrid, Title } from "@mantine/core"
import SetCard from "~/components/room/Game/games/Set/components/SetCard"
import { NUM_OF_CARDS } from "../../SetConfigurator"
import { generateNewSetQuestion } from "../../helpers"
import type { ICreateSetContainerProps } from "./createSetContainer.types"

const CreateSetContainer: React.FC<ICreateSetContainerProps> = ({ question, setQuestion, onAddQuestion, onUpdateQuestion, mode }) => {

    const cardElements = question.cards.map((item, index) => <SetCard isFlipped key={index} editable card={item} setCards={setQuestion} index={index} />)

    const handleSubmitQuestion = () => {
        if (mode === "ADD") {
            onAddQuestion(question)
        } else if (mode === "UPDATE") {
            onUpdateQuestion(question)
        }

        setQuestion(generateNewSetQuestion(NUM_OF_CARDS))
    }

    return (
        <Flex direction="column" gap="lg" w="100%" justify="center" align="center" >
            <Title order={3}>Set erstellen</Title>

            <SimpleGrid cols={3} spacing="md" verticalSpacing="md">
                {cardElements}
            </SimpleGrid>

            <Button onClick={handleSubmitQuestion}>Set {mode === "ADD" ? "hinzufügen" : "speichern"}</Button>
        </Flex>
    )
}

export default CreateSetContainer