import { Button, Flex } from "@mantine/core";
import React from "react";
import Scorebar from "../Scorebar";
import useSyncedRoom from "~/hooks/useSyncedRoom";
import AnswerBanner from "../AnswerBanner";
import useBuzzer from "~/hooks/useBuzzer";
import { useUser } from "~/hooks/useUser";

const RoomFooter = () => {
  const room = useSyncedRoom();
  const { buzzer } = useBuzzer();
  const { isPlayer } = useUser();

  return (
    <Flex justify="space-between" align="flex-end" data-testid="room-footer">
      <Scorebar team={room.teams.teamOne} timerPosition="right" />
      <Flex direction="column" align="center" gap="sm">
        <AnswerBanner
          answer={room.context.answerState.answer}
          size="l"
          showAnswer={room.context.answerState.isAnswerDisplayed}
          mx="xl"
        />
        {isPlayer && (
          <Button
            data-testid="buzzer-btn"
            size="lg"
            color="red"
            onClick={() => buzzer({ withTimer: true })}
          >
            Buzzern
          </Button>
        )}
      </Flex>
      <Scorebar team={room.teams.teamTwo} timerPosition="left" />
    </Flex>
  );
};

export default RoomFooter;
