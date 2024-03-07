import { Box, Button } from "@mantine/core";
import React, { useEffect } from "react";
import useSyncedRoom from "~/hooks/useSyncedRoom";
import useTimer from "~/hooks/useTimer";

const RoomHeader = () => {
  const room = useSyncedRoom();

  const roomHeader = room.context.header;
  const { pauseTimer, startTimer, active, resetTimer } = useTimer(roomHeader.timer);

  const handleBtnClick = () => {
    if (active) {
      pauseTimer();
    } else {
      startTimer();
    }
  };

  return (
    <Box
      h={125}
      // bg="red"
    >
      <h1>Timer: {roomHeader.timer.currSeconds}</h1>
      <Button onClick={handleBtnClick}>{active ? "Pause" : "Start"} Timer</Button>
      <Button onClick={resetTimer}>Reset Timer</Button>
    </Box>
  );
};

export default RoomHeader;
