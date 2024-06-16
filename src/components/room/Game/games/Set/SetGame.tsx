import { Button, Flex, SimpleGrid, Text } from "@mantine/core";
import React from "react";
import { findSets } from "~/components/gameshows/SetConfigurator/helpers";
import ModView from "~/components/shared/ModView";
import { useUser } from "~/hooks/useUser";
import { goToNextQuestion, goToPreviousQuestion, sleep } from "~/utils/helpers";
import SetCard from "./components/SetCard";
import type { ISetGameProps } from "./set.types";

const SetGame: React.FC<ISetGameProps> = ({ game }) => {
  const { isHost, hostFunction } = useUser();
  const currQuestion = game.questions[game.qIndex];
  const possibleSets = findSets(currQuestion?.cards ?? []);

  const handleSelectCard = hostFunction((cardIndex: number) => {
    if (game.display.markedCards) return;
    if (game.markedCards.includes(cardIndex)) {
      game.markedCards = game.markedCards.filter((card) => card !== cardIndex);
    } else {
      game.markedCards.push(cardIndex);
    }
  });

  const handleFlipAllCards = hostFunction(() => {
    if (!currQuestion) return;

    if (game.openedCards.length > 0) {
      game.openedCards = [];
    } else {
      game.openedCards = currQuestion.cards.map((_, idx) => idx);
    }

    game.markedCards = [];
    game.markedCardsState = "marked";
    game.display.markedCards = false;
  });

  const handleShowMarkedCards = hostFunction(() => {
    game.display.markedCards = true;
  });

  const prepareQuestion = async () => {
    game.markedCards = [];
    game.openedCards = [];
    game.markedCardsState = "marked";
    game.display.markedCards = false;
    await sleep(500);
  };

  const handleNextQuestion = hostFunction(async () => {
    await prepareQuestion();
    goToNextQuestion(game.questions, game.qIndex, (newIndex) => {
      game.qIndex = newIndex;
    });
    await sleep(500);
    handleFlipAllCards();
  });

  const handlePrevQuestion = hostFunction(async () => {
    await prepareQuestion();
    goToPreviousQuestion(game.qIndex, (newIndex) => {
      game.qIndex = newIndex;
    });
    await sleep(500);
    handleFlipAllCards();
  });

  const handleShowAnswer = hostFunction(() => {
    const isContained = possibleSets.some((set) => {
      // check, if every element in 'cards' is contained in current 'set'
      return game.markedCards.every((card) => set.includes(card));
    });

    if (isContained) {
      game.markedCardsState = "correct";
    } else {
      game.markedCardsState = "wrong";
    }
  });

  const handleMarkedCardClick = hostFunction(() => {
    if (!game.display.markedCards) {
      handleShowMarkedCards();
    } else {
      handleShowAnswer();
    }
  });

  const PossibleSets = () => (
    <>
      <Text c="dimmed">Mögliche Sets</Text>
      {possibleSets.length === 0 && "Mit diesem Stapel ist kein Set möglich"}
      {possibleSets.map((s, idx) => {
        const cardNumbers = s.map((s) => s + 1);

        return (
          <Flex key={idx}>
            Set {idx + 1}: {cardNumbers.join(",")}
          </Flex>
        );
      })}
    </>
  );

  return (
    <Flex
      gap="xl"
      pos="relative"
    >
      {/* Left content */}
      <Flex
        direction="column"
        gap="sm"
      >
        <SimpleGrid
          cols={3}
          verticalSpacing="xs"
          spacing="xs"
          style={{
            perspective: "100rem",
          }}
        >
          {currQuestion?.cards.map((card, idx) => {
            const isMarked = game.markedCards.includes(idx);

            return (
              <SetCard
                key={card.id}
                card={card}
                index={idx}
                isFlipped={game.openedCards.includes(idx)}
                marked={(isMarked && game.display.markedCards) || (isMarked && isHost)}
                markerState={game.markedCardsState}
                onClick={handleSelectCard}
              />
            );
          })}
        </SimpleGrid>

        <span style={{ textAlign: "center" }}>
          Set {game.qIndex + 1} / {game.questions.length}
        </span>
      </Flex>

      {/* Right Content */}
      <ModView>
        <Flex
          direction="column"
          gap="md"
          w="15rem"
        >
          <div style={{ height: "10rem" }}>
            <PossibleSets />
          </div>

          <Button.Group orientation="vertical">
            <Button
              onClick={handleFlipAllCards}
              variant="default"
            >
              Karten umdrehen
            </Button>
            <Button
              onClick={handleMarkedCardClick}
              variant="default"
              disabled={game.markedCards.length !== 3 || game.markedCardsState !== "marked"}
            >
              {game.display.markedCards ? "Antwort zeigen" : "Markierten Karten zeigen"}
            </Button>
            <Button
              onClick={handlePrevQuestion}
              variant="default"
              disabled={game.qIndex <= 0}
            >
              Vorherigen Stapel
            </Button>
            <Button
              onClick={handleNextQuestion}
              variant="default"
              disabled={game.qIndex >= game.questions.length - 1}
            >
              Nächsten Stapel
            </Button>
          </Button.Group>
        </Flex>
      </ModView>
    </Flex>
  );
};

export default SetGame;
