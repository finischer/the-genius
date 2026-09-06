import { Flex, Image } from "@mantine/core";
import React from "react";
import GameNavControls from "~/components/shared/GameNavControls";
import ModControlBar from "~/components/shared/ModControlBar";
import RevealButton from "~/components/shared/RevealButton";
import useSyncedRoom from "~/hooks/useSyncedRoom";
import { useUser } from "~/hooks/useUser";
import { goToNextQuestion, goToPreviousQuestion, sleep } from "~/utils/helpers";
import classes from "./flaggen.module.css";
import { type IFlaggenGameProps } from "./flaggen.types";

const FlaggenGame: React.FC<IFlaggenGameProps> = ({ game }) => {
  const room = useSyncedRoom();
  const { isHost, hostFunction } = useUser();
  const displayFlag = game.display.country;
  const currFlag = game.countries[game.qIndex];
  const shortCode = currFlag ? String(currFlag.shortCode) : null;

  const handleFlagClick = hostFunction(() => {
    if (displayFlag) return;
    game.display.country = true;
  });

  const prepareQuestion = async () => {
    game.display.answer = false;
    game.display.country = false;
    room.context.answerState.answer = "";
    room.context.answerState.isAnswerDisplayed = false;
    if (displayFlag) {
      await sleep(800);
    }
  };

  const handleNextFlagClick = hostFunction(async () => {
    await prepareQuestion();
    goToNextQuestion(game.countries, game.qIndex, (newIndex) => {
      game.qIndex = newIndex;
    });
  });

  const handlePrevFlagClick = hostFunction(async () => {
    await prepareQuestion();
    goToPreviousQuestion(game.qIndex, (newIndex) => {
      game.qIndex = newIndex;
    });
  });

  const handleShowAnswerClick = hostFunction(() => {
    if (!currFlag?.country) return;
    game.display.answer = true;
    room.context.answerState.answer = currFlag.country;
    room.context.answerState.isAnswerDisplayed = true;
  });

  return (
    <Flex direction="column" gap="md" align="center">
      {currFlag && shortCode && (
        <Image
          className={classes.flagImg}
          src={`https://flagcdn.com/w640/${shortCode}.png`}
          alt="Image not found"
          w={400}
          radius="sm"
          opacity={displayFlag ? 1 : isHost ? 0.5 : 0}
          onClick={handleFlagClick}
          data-hostandnoflag={isHost && !displayFlag}
          style={{
            transform: `scale(${displayFlag ? "1" : "0.9"})`,
            transition: "all 500ms",
            userSelect: "none"
          }}
        />
      )}

      <ModControlBar>
        <RevealButton
          onReveal={handleShowAnswerClick}
          revealed={game.display.answer}
          label="Antwort"
        />
      </ModControlBar>

      <GameNavControls
        currentIndex={game.qIndex}
        total={game.countries.length}
        onPrev={handlePrevFlagClick}
        onNext={handleNextFlagClick}
        label="Flagge"
      />
    </Flex>
  );
};

export default FlaggenGame;
