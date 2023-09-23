import { Button, Flex, SimpleGrid, Text, Title } from "@mantine/core"
import SetCard from "~/components/room/Game/games/Set/components/SetCard"
import { NUM_OF_CARDS } from "../../SetConfigurator"
import { findSets, generateNewSetQuestion } from "../../helpers"
import type { ICreateSetContainerProps } from "./createSetContainer.types"
import { useEffect } from "react"

const CreateSetContainer: React.FC<ICreateSetContainerProps> = ({ question, setQuestion, onAddQuestion, onUpdateQuestion, mode }) => {
    const possibleSets = findSets(question.cards)

    const cardElements = question.cards.map((item, index) => <SetCard isFlipped key={item.id} editable card={item} setCards={setQuestion} index={index} />)

    const handleSubmitQuestion = () => {
        if (mode === "ADD") {
            onAddQuestion(question)
        } else if (mode === "UPDATE") {
            onUpdateQuestion(question)
        }

        setQuestion(generateNewSetQuestion(NUM_OF_CARDS))
    }

    return (
        <Flex direction="column" gap="lg" align="center">
            <Title order={3}>Set erstellen</Title>

            <SimpleGrid cols={3} spacing="md" verticalSpacing="md">
                {cardElements}
            </SimpleGrid>

            {/* Possible sets */}
            <Flex direction="column" align="center">
                <Text color="dimmed">Mögliche Sets</Text>
                {possibleSets.length === 0 && "Mit diesem Stapel ist kein Set möglich"}
                {possibleSets.map((s, idx) => {
                    const cardNumbers = s.map(s => s + 1);

                    return <Flex>
                        Set {idx + 1}: {cardNumbers.join(",")}
                    </Flex>

                })}
            </Flex>

            <Button onClick={handleSubmitQuestion} disabled={possibleSets.length === 0}>Set {mode === "ADD" ? "hinzufügen" : "speichern"}</Button>
        </Flex>
    )
}

export default CreateSetContainer