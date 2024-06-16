import { Flex } from "@mantine/core";
import React from "react";
import Scorebar from "./Scorebar";
import useSyncedRoom from "~/hooks/useSyncedRoom";
import AnswerBanner from "./AnswerBanner";

const RoomFooter = () => {
  const room = useSyncedRoom();

  return (
    <Flex
      justify="space-between"
      align="flex-end"
    >
      <Scorebar
        team={room.teams.teamOne}
        timerPosition="right"
      />
      <AnswerBanner
        answer={room.context.answerState.answer}
        size="l"
        showAnswer={room.context.answerState.isAnswerDisplayed}
        mx="xl"
      />
      <Scorebar
        team={room.teams.teamTwo}
        timerPosition="left"
      />
    </Flex>
  );
};

export default RoomFooter;
