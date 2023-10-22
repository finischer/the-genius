import { Flex, keyframes } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useRoom } from "~/hooks/useRoom";
import { animations, zoomInAnimation, zoomOutAnimation } from "~/utils/animations";
import FlaggenGame from "./games/Flaggen/FlaggenGame";
import { type TFlaggenGameState } from "./games/Flaggen/config";
import { type IGameProps, type TGameMap, type TGameNames } from "./games/game.types";
import MemoryGame from "./games/Memory/MemoryGame";
import { type TMemoryGameState } from "./games/Memory/config";
import MerkenGame from "./games/Merken/MerkenGame";
import { type TMerkenGameState } from "./games/Merken/config";
import FlipCard from "~/components/shared/FlipCard/FlipCard";
import { AnimatePresence, motion } from "framer-motion";
import GeheimwörterGame from "./games/Geheimwörter/GeheimwörterGame";
import type { TGeheimwörterGameState } from "./games/Geheimwörter/config";
import SetGame from "./games/Set/SetGame";
import type { TSetGameState } from "./games/Set/config";
import DuSagstGame from "./games/DuSagst/DuSagstGame";
import type { TDuSagstGameState } from "./games/DuSagst/config";
import ReferatBingoGame from "./games/ReferatBingo/ReferatBingoGame";
import type { TReferatBingoGameState } from "./games/ReferatBingo/config";

const scaleAnimation = keyframes({
  "0%": { transform: "scale(1,1)" },
  "100%": { transform: "scale(1.4,1.4)" },
});

// Wrapper for the games
// Handles also the intro sequence
const Game: React.FC<IGameProps> = ({ game }) => {
  const { room } = useRoom();

  const introState = room.state.display.gameIntro;
  const showGame = room.state.display.game;
  const gameNumber = room.games.findIndex((g) => g.identifier === game.identifier) + 1;

  const [mountIntroContainer, setMountIntroContainer] = useState(true);

  function getGame(identifier: TGameNames) {
    const GAME_MAP: TGameMap = {
      flaggen: <FlaggenGame game={game as TFlaggenGameState} />,
      merken: <MerkenGame game={game as TMerkenGameState} />,
      memory: <MemoryGame game={game as TMemoryGameState} />,
      geheimwoerter: <GeheimwörterGame game={game as TGeheimwörterGameState} />,
      set: <SetGame game={game as TSetGameState} />,
      duSagst: <DuSagstGame game={game as TDuSagstGameState} />,
      referatBingo: <ReferatBingoGame game={game as TReferatBingoGameState} />,
    };

    return GAME_MAP[identifier];
  }

  useEffect(() => {
    if (introState.alreadyPlayed && !showGame) {
      setTimeout(() => {
        setMountIntroContainer(false);
      }, 1000);
    } else if (showGame) {
      setMountIntroContainer(false);
    } else {
      setMountIntroContainer(true);
    }
  }, [introState.alreadyPlayed, showGame]);

  return (
    <>
      <AnimatePresence>
        {showGame && <motion.div {...animations.fadeInOut}>{getGame(game.identifier)}</motion.div>}
      </AnimatePresence>

      {mountIntroContainer && (
        <Flex
          direction="column"
          gap="lg"
          justify="center"
          align="center"
          sx={{
            animation: `${zoomInAnimation} 2s, ${zoomOutAnimation} 500ms 8s, ${scaleAnimation} 6s 2s`,
            opacity: introState.alreadyPlayed ? 0 : 1,
          }}
        >
          <FlipCard
            isFlipped={introState.flippedTitleBanner}
            front={`Spiel ${gameNumber}`}
            back={game.name}
          />
        </Flex>
      )}
    </>
  );
};

export default Game;
