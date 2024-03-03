import { Flex } from "@mantine/core";
import React from "react";
import Scorebar from "./Scorebar";
import useSyncedRoom from "~/hooks/useSyncedRoom";

const RoomFooter = () => {
  const room = useSyncedRoom();

  return (
    <Flex
      justify="space-between"
      align="flex-end"
      bg="green"
    >
      <Scorebar
        team={room.teams.teamOne}
        timerPosition="right"
      />
      {/* <AnswerBanner
             answer={room.state.answerState.answer}
             size="l"
             showAnswer={room.state.answerState.showAnswer}
             mx="xl"
           /> */}
      <Scorebar
        team={room.teams.teamTwo}
        timerPosition="left"
      />
    </Flex>
  );
};

export default RoomFooter;
