import { Flex } from "@mantine/core";
import React from "react";
import GameNavControls from "~/components/shared/GameNavControls";
import ModControlBar from "~/components/shared/ModControlBar";
import ModToggle from "~/components/shared/ModToggle";
import RevealButton from "~/components/shared/RevealButton";
import useSyncedRoom from "~/hooks/useSyncedRoom";
import { useUser } from "~/hooks/useUser";
import { goToNextQuestion, goToPreviousQuestion, sleep } from "~/utils/helpers";
import classes from "./flaggen.module.css";
import { type IFlaggenGameProps } from "./flaggen.types";

const FlaggenGame: React.FC<IFlaggenGameProps> = ({ game }) => {
  const room = useSyncedRoom();
  const { hostFunction } = useUser();
  const currFlag = game.countries[game.qIndex];
  const shortCode = currFlag ? String(currFlag.shortCode) : null;

  const prepareQuestion = async () => {
    game.display.answer = false;
    room.context.answerState.answer = "";
    room.context.answerState.isAnswerDisplayed = false;
    await sleep(800);
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
        <ModToggle id="flaggen-flag" label="Flagge">
          <img
            className={classes.flagImg}
            src={`https://flagcdn.com/w640/${shortCode}.png`}
            alt={currFlag.country ?? "Flagge"}
            width={400}
            style={{
              borderRadius: "var(--mantine-radius-sm)",
              userSelect: "none",
              display: "block"
            }}
          />
        </ModToggle>
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
