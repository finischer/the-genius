import { Button, Flex } from "@mantine/core";
import React from "react";
import ModView from "~/components/shared/ModView";
import useAudio from "~/hooks/useAudio";
import { useUser } from "~/hooks/useUser";
import MerkenPlayground from "./components/MerkenPlayground/MerkenPlayground";
import { type IMerkenGameProps } from "./merken.types";

const MerkenGame: React.FC<IMerkenGameProps> = ({ game }) => {
  const { isHost, hostFunction } = useUser();
  const isStartButtonDisabled = game.timerState.isActive;
  const { triggerAudioEvent } = useAudio();

  const handleStartGame = hostFunction(() => {
    if (isStartButtonDisabled) return;
    game.allCardsFlipped = true;

    // TODO: Start room timer
  });

  const handleCardClick = hostFunction((index: number) => {
    // TODO: Play sound
    //   triggerAudioEvent("playSound", "whoosh_1");

    if (game.openCards.includes(index)) {
      const newOpenCards = game.openCards.filter((card) => card !== index);
      game.openCards = newOpenCards;
    } else {
      game.openCards.push(index);
    }
  });

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
