import { Flex } from "@mantine/core";
import { AnimatePresence, motion, useAnimate } from "framer-motion";
import React, { useEffect, useState } from "react";
import FlipCard from "~/components/shared/FlipCard/FlipCard";
import { useRoom } from "~/hooks/useRoom";
import { animations } from "~/utils/animations";
import DuSagstGame from "./games/DuSagst/DuSagstGame";
import type { TDuSagstGameState } from "./games/DuSagst/config";
import FlaggenGame from "./games/Flaggen/FlaggenGame";
import { type TFlaggenGameState } from "./games/Flaggen/config";
import GeheimwörterGame from "./games/Geheimwörter/GeheimwörterGame";
import type { TGeheimwörterGameState } from "./games/Geheimwörter/config";
import MerkenGame from "./games/Merken/MerkenGame";
import { type TMerkenGameState } from "./games/Merken/config";
import ReferatBingoGame from "./games/ReferatBingo/ReferatBingoGame";
import type { TReferatBingoGameState } from "./games/ReferatBingo/config";
import SetGame from "./games/Set/SetGame";
import type { TSetGameState } from "./games/Set/config";
import { Game as GameEnum, type IGameProps, type TGame, type TGameMap } from "./games/game.types";
import useSyncedRoom from "~/hooks/useSyncedRoom";

// Wrapper for the games
// Handles also the intro sequence
const Game: React.FC<IGameProps> = ({ gameName }) => {
  const room = useSyncedRoom();

  const game = room.games.find((game) => game.name === gameName) as TGame;

  const introState = room.context.gameIntro;
  const showGame = room.context.display.game;
  const gameNumber = room.games.findIndex((g) => g.identifier === game.identifier) + 1;

  const [mountIntroContainer, setMountIntroContainer] = useState(true);

  // const [scope, animate] = useAnimate();

  // const introAnimation = async () => {
  //   await animate(scope.current, { scale: 1 }, { duration: 0.5, delay: 0.5 });
  //   await animate(scope.current, { scale: 1.4 }, { duration: 6 });
  //   await animate(scope.current, { scale: 0 }, { duration: 0.5 });
  // };

  function getGame(identifier: GameEnum) {
    const GAME_MAP: TGameMap = {
      flaggen: <FlaggenGame game={game as TFlaggenGameState} />,
      merken: <MerkenGame game={game as TMerkenGameState} />,
      geheimwoerter: <GeheimwörterGame game={game as TGeheimwörterGameState} />,
      set: <SetGame game={game as TSetGameState} />,
      duSagst: <DuSagstGame game={game as TDuSagstGameState} />,
      referatBingo: <ReferatBingoGame game={game as TReferatBingoGameState} />,
    };

    return GAME_MAP[identifier];
  }

  // useEffect(() => {
  //   if (introState.alreadyPlayed && !showGame) {
  //     setTimeout(() => {
  //       setMountIntroContainer(false);
  //     }, 1000);
  //   } else if (showGame) {
  //     setMountIntroContainer(false);
  //   } else {
  //     setMountIntroContainer(true);
  //     void introAnimation();
  //   }
  // }, [introState.alreadyPlayed, showGame]);

  return (
    <>
      {/* <AnimatePresence>
        {showGame && <motion.div {...animations.fadeInOut}>{getGame(game.identifier)}</motion.div>}
      </AnimatePresence> */}
      <AnimatePresence>
        <motion.div {...animations.fadeInOut}>{getGame(game.identifier)}</motion.div>
      </AnimatePresence>

      {/* <motion.div
        ref={scope}
        hidden={!mountIntroContainer || showGame}
        initial={{ scale: 0 }}
      >
        <Flex
          direction="column"
          gap="lg"
          justify="center"
          align="center"
        >
          <FlipCard
            isFlipped={introState.flippedTitleBanner}
            front={`Spiel ${gameNumber}`}
            back={game.name}
          />
        </Flex>
      </motion.div> */}
    </>
  );
};

export default Game;
