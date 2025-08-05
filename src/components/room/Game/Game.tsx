import { Flex } from "@mantine/core";
import { AnimatePresence, motion, useAnimate } from "framer-motion";
import React, { useEffect } from "react";
import FlipCard from "~/components/shared/FlipCard/FlipCard";
import {
  GAME_COMPONENTS,
  type Game as GameEnum,
  type IGameProps
} from "~/games";
import useAudio from "~/hooks/useAudio";
import useSyncedRoom from "~/hooks/useSyncedRoom";
import { animations } from "~/utils/animations";

const SECONDS_TO_ROTATE_TITLE_BANNER = 4;
const SECONDS_TOTAL_INTRO_DURATION = 8;
const SECONDS_DELAY_BEFORE_GAME_DISPLAYS = 2;

// Wrapper for the games
// Handles also the intro sequence
const Game: React.FC<IGameProps> = ({ gameName }) => {
  const room = useSyncedRoom();
  const { triggerAudioEvent } = useAudio();
  const [scope, animate] = useAnimate();

  const game = room.games.find((game) => game.identifier === gameName);

  const introAnimation = async () => {
    const sequence = [
      [scope.current, { scale: 1 }, { duration: 0.5, delay: 0.5 }],
      [scope.current, { scale: 1.4 }, { duration: 6 }],
      [scope.current, { scale: 0 }, { duration: 0.5 }]
    ];

    // @ts-expect-error
    await animate(sequence);
    // await animate(
    //   scope.current,
    //   { scale: 1 },
    //   { duration: 0.5, delay: 0.5, onUpdate: (latest) => console.log("Latest: ", latest) }
    // );
    // await animate(scope.current, { scale: 1.4 }, { duration: 6 });
    // await animate(scope.current, { scale: 0 }, { duration: 0.5 });
  };

  useEffect(() => {
    if (introIsPlaying) {
      triggerAudioEvent("playSound", "intro");
      room.context.display.game = false;

      introState.alreadyPlayed = false;
      introState.flippedTitleBanner = false;
      introState.milliseconds = 0;

      void introAnimation();

      setTimeout(() => {
        introState.flippedTitleBanner = true;
      }, SECONDS_TO_ROTATE_TITLE_BANNER * 1000);

      setTimeout(() => {
        introState.alreadyPlayed = true;

        setTimeout(() => {
          room.context.display.game = true;
          room.context.display.gameIntro = false;
        }, SECONDS_DELAY_BEFORE_GAME_DISPLAYS * 1000);
      }, SECONDS_TOTAL_INTRO_DURATION * 1000);
    }
  }, [room.context.display.gameIntro]);

  if (!game) {
    return <div>Loading ...</div>;
  }

  const introState = room.context.gameIntro;
  const introIsPlaying = room.context.display.gameIntro;
  const showGame = room.context.display.game;
  const gameNumber =
    room.games.findIndex((g) => g.identifier === game.identifier) + 1;

  function getGame(identifier: GameEnum) {
    const GameComponent = GAME_COMPONENTS[identifier];
    if (!GameComponent || !game) {
      return <div>Spiel nicht gefunden: {identifier}</div>;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
    return <GameComponent game={game as any} />;
  }

  return (
    <>
      <AnimatePresence>
        {showGame && !introIsPlaying && (
          <motion.div {...animations.fadeInOut}>
            {getGame(game.identifier)}
          </motion.div>
        )}
      </AnimatePresence>
      {/* <AnimatePresence>
        <motion.div {...animations.fadeInOut}>{getGame(game.identifier)}</motion.div>
      </AnimatePresence> */}
      <motion.div
        ref={scope}
        hidden={!introIsPlaying || showGame}
        initial={{ scale: 0 }}
      >
        <Flex direction="column" gap="lg" justify="center" align="center">
          <FlipCard
            isFlipped={introState.flippedTitleBanner}
            front={`Spiel ${gameNumber}`}
            back={game.name}
          />
        </Flex>
      </motion.div>
    </>
  );
};

export default Game;
