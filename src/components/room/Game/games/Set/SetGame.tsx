import { Button, Container, Flex, SimpleGrid, Text } from "@mantine/core";
import React from "react";
import { findSets } from "~/components/gameshows/SetConfigurator/helpers";
import { socket } from "~/hooks/useSocket";
import { useUser } from "~/hooks/useUser";
import SetCard from "./components/SetCard";
import type { ISetGameProps } from "./set.types";
import ContainerBox from "~/components/shared/ContainerBox";
import ModView from "~/components/shared/ModView";

const SetGame: React.FC<ISetGameProps> = ({ game }) => {
  const { isHost } = useUser();
  const currQuestion = game.questions[game.qIndex];
  const possibleSets = findSets(currQuestion?.cards ?? []);

  const handleSelectCard = (cardIndex: number) => {
    if (!isHost || game.display.markedCards) return;
    socket.emit("set:toggleCard", cardIndex);
  };

  const handleFlipAllCards = () => {
    if (!isHost) return;
    socket.emit("set:flipAllCards");
  };

  const handleShowMarkedCards = () => {
    if (!isHost) return;
    socket.emit("set:showMarkedCards");
  };

  const handleNextQuestion = () => {
    if (!isHost || game.qIndex >= game.questions.length - 1) return;
    socket.emit("set:nextQuestion");
  };

  const handlePrevQuestion = () => {
    if (!isHost || game.qIndex <= 0) return;
    socket.emit("set:prevQuestion");
  };

  const handleShowAnswer = () => {
    if (!isHost) return;

    socket.emit("set:changeMarkerState", possibleSets);
  };

  const handleMarkedCardClick = () => {
    if (!isHost) return;

    if (!game.display.markedCards) {
      handleShowMarkedCards();
    } else {
      handleShowAnswer();
    }
  };

  const PossibleSets = () => (
    <>
      <Text color="dimmed">Mögliche Sets</Text>
      {possibleSets.length === 0 && "Mit diesem Stapel ist kein Set möglich"}
      {possibleSets.map((s, idx) => {
        const cardNumbers = s.map((s) => s + 1);

        return (
          <Flex>
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
          sx={{
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
                marked={
                  (isMarked && game.display.markedCards) || (isMarked && isHost)
                }
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
              disabled={
                game.markedCards.length !== 3 ||
                game.markedCardsState !== "marked"
              }
            >
              {game.display.markedCards
                ? "Antwort zeigen"
                : "Markierten Karten zeigen"}
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
