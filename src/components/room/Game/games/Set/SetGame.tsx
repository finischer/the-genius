import React, { useEffect } from "react";
import type { ISetGameProps } from "./set.types";
import { Flex, SimpleGrid, Text } from "@mantine/core";
import SetCard from "./components/SetCard";
import { findSets } from "~/components/gameshows/SetConfigurator/helpers";
import { useUser } from "~/hooks/useUser";
import { useImmer } from "use-immer";

const SetGame: React.FC<ISetGameProps> = ({ game }) => {
  const { isHost } = useUser();
  const currQuestion = game.questions[game.qIndex];
  const possibleSets = findSets(currQuestion?.cards ?? []);

  const [flippedCards, setFlippedCards] = useImmer<string[]>([]);

  const handleFlipCard = (id: string) => {
    // TODO: Handle select card instead of flip (only for moderator)
    setFlippedCards((draft) => {
      if (flippedCards.includes(id)) {
        return draft.filter((cardId) => id !== cardId);
      } else {
        draft.push(id);
      }
    });
  };

  return (
    <Flex
      direction="column"
      gap="xl"
    >
      <SimpleGrid
        cols={3}
        sx={{
          perspective: "100rem",
        }}
      >
        {currQuestion?.cards.map((card, idx) => (
          <SetCard
            key={card.id}
            card={card}
            index={idx}
            isFlipped={flippedCards.includes(card.id)}
            onClick={handleFlipCard}
          />
        ))}
      </SimpleGrid>

      {isHost && (
        <Flex
          direction="column"
          align="center"
        >
          <Text color="dimmed">Mögliche Sets</Text>
          {possibleSets.length === 0 &&
            "Mit diesem Stapel ist kein Set möglich"}
          {possibleSets.map((s, idx) => {
            const cardNumbers = s.map((s) => s + 1);

            return (
              <Flex>
                Set {idx + 1}: {cardNumbers.join(",")}
              </Flex>
            );
          })}
        </Flex>
      )}
    </Flex>
  );
};

export default SetGame;
