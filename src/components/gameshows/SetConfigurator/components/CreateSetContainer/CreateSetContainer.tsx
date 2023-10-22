import { Flex, SimpleGrid, Text, Title } from "@mantine/core";
import SetCard from "~/components/room/Game/games/Set/components/SetCard";
import { findSets } from "../../helpers";
import type { ICreateSetContainerProps } from "./createSetContainer.types";

const CreateSetContainer: React.FC<ICreateSetContainerProps> = ({ question, setQuestion }) => {
  const possibleSets = findSets(question.cards);

  const cardElements = question.cards.map((item, index) => (
    <SetCard
      isFlipped
      key={item.id}
      editable
      card={item}
      setCards={setQuestion}
      index={index}
    />
  ));

  return (
    <Flex
      direction="column"
      gap="lg"
      align="center"
    >
      <Title order={3}>Set erstellen</Title>

      <SimpleGrid
        cols={3}
        spacing="md"
        verticalSpacing="md"
      >
        {cardElements}
      </SimpleGrid>

      {/* Possible sets */}
      <Flex
        direction="column"
        align="center"
      >
        <Text color="dimmed">Mögliche Sets</Text>
        {possibleSets.length === 0 && "Mit diesem Stapel ist kein Set möglich"}
        {possibleSets.map((s, idx) => {
          const cardNumbers = s.map((s) => s + 1);

          return (
            <Flex key={idx}>
              Set {idx + 1}: {cardNumbers.join(",")}
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
};

export default CreateSetContainer;
