import { Button, Flex } from "@mantine/core";
import React from "react";
import ModView from "~/components/shared/ModView";
import useAudio from "~/hooks/useAudio";
import useSyncedRoom from "~/hooks/useSyncedRoom";
import useTimer from "~/hooks/useTimer";
import { useUser } from "~/hooks/useUser";
import { TimerType } from "~/types/gameshow.types";
import MerkenPlayground from "./components/MerkenPlayground/MerkenPlayground";
import { type IMerkenGameProps } from "./merken.types";

const MerkenGame: React.FC<IMerkenGameProps> = ({ game }) => {
  const { isHost, hostFunction } = useUser();
  const { triggerAudioEvent } = useAudio();
  const room = useSyncedRoom();
  const { startTimer, active: isTimerActive } = useTimer(
    room.context.header.timer,
    TimerType.COUNTDOWN,
    game.timerState.timeToThinkSeconds
  );

  const handleStartGame = hostFunction(() => {
    if (isTimerActive) return;
    game.allCardsFlipped = true;

    startTimer(() => {
      game.allCardsFlipped = false;
    });
  });

  const handleCardClick = hostFunction((index: number) => {
    // TODO: Play sound
    triggerAudioEvent("playSound", "whoosh_1");

    if (game.openCards.includes(index)) {
      const newOpenCards = game.openCards.filter((card) => card !== index);
      game.openCards = newOpenCards;
    } else {
      game.openCards.push(index);
    }
  });

  return (
    <Flex direction="column" gap="lg">
      <MerkenPlayground
        cards={game.cards}
        openCards={game.openCards}
        clickable={isHost}
        allCardsFlipped={game.allCardsFlipped}
        onCardClick={handleCardClick}
      />
      <ModView>
        <Button onClick={handleStartGame} disabled={isTimerActive}>
          Spiel starten
        </Button>
      </ModView>
    </Flex>
  );
};

export default MerkenGame;
