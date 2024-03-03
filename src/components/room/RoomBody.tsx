import { Box, Flex } from "@mantine/core";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import useSyncedRoom from "~/hooks/useSyncedRoom";
import { RoomView } from "~/types/gameshow.types";
import Scoreboard from "./Scoreboard/Scoreboard";
import { animations } from "~/utils/animations";
import { ScoreboardColor } from "./Scoreboard/scoreboard.types";

const RoomBody = () => {
  const room = useSyncedRoom();
  return (
    <Flex
      h="100%"
      justify="center"
      align="center"
    >
      {/* {currentGame && room.state.view === "GAME" && <Game game={currentGame} />} */}
      <AnimatePresence>
        {room.context.view === RoomView.SCOREBOARD && (
          <motion.div {...animations.fadeInOut}>
            <Flex
              direction="column"
              gap="xl"
            >
              <Scoreboard
                team={room.teams.teamOne}
                color={ScoreboardColor.GREEN}
              />
              <Scoreboard
                team={room.teams.teamTwo}
                color={ScoreboardColor.RED}
              />
            </Flex>
          </motion.div>
        )}
      </AnimatePresence>
    </Flex>
  );
};

export default RoomBody;
