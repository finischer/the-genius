import React from "react";
import { type IMerkenGameProps } from "./merken.types";
import MerkenPlayground from "./components/MerkenPlayground/MerkenPlayground";
import { Button, Flex } from "@mantine/core";
import { socket } from "~/hooks/useSocket";
import { useUser } from "~/hooks/useUser";
import ModView from "~/components/shared/ModView";

const MerkenGame: React.FC<IMerkenGameProps> = ({ game }) => {
  const { isHost } = useUser();
  const isStartButtonDisabled = game.timerState.isActive;

  const handleStartGame = () => {
    if (!isHost || isStartButtonDisabled) return; // to make sure not start the game unintentionally
    socket.emit("merken:startGame");
  };

  const handleCardClick = (index: number) => {
    socket.emit("merken:flipCard", { cardIndex: index });
  };

  return (
    <Flex
      direction="column"
      gap="lg"
    >
      <MerkenPlayground
        cards={game.cards}
        openCards={game.openCards}
        clickable={isHost}
        allCardsFlipped={game.allCardsFlipped}
        onCardClick={handleCardClick}
      />
      <ModView>
        <Button
          onClick={handleStartGame}
          disabled={isStartButtonDisabled}
        >
          Spiel starten
        </Button>
      </ModView>
    </Flex>
  );
};

export default MerkenGame;
