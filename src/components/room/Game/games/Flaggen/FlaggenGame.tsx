import { Button, Flex, Image, Text } from "@mantine/core";
import React from "react";
import ArrowActionButton from "~/components/shared/ArrowActionButton";
import ModView from "~/components/shared/ModView";
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
  const nxtBtnDisabled = game.qIndex >= game.countries.length - 1;
  const prevBtnDisabled = game.qIndex <= 0;

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
    <Flex
      direction="column"
      gap="md"
      align="center"
    >
      <ModView>
        <Text>
          Flagge {game.qIndex + 1} / {game.countries.length}
        </Text>
      </ModView>
      <Flex
        gap="4rem"
        align="center"
        pos="relative"
      >
        <ModView>
          <ArrowActionButton
            arrowDirection="left"
            tooltip="Vorherige Flagge zeigen"
            disabled={prevBtnDisabled}
            onClick={handlePrevFlagClick}
          />
        </ModView>
        {currFlag && (
          <Image
            className={classes.flagImg}
            src={`https://flagcdn.com/w640/${currFlag.shortCode}.png`}
            alt="Image not found"
            radius="sm"
            opacity={displayFlag ? 1 : isHost ? 0.5 : 0}
            onClick={handleFlagClick}
            data-hostAndNoFlag={isHost && !displayFlag}
            style={{
              transform: `scale(${displayFlag ? "1" : "0.9"})`,
              transition: "all 500ms",
              userSelect: "none",
            }}
          />
        )}
        <ModView>
          <ArrowActionButton
            arrowDirection="right"
            tooltip="Nächste Flagge zeigen"
            disabled={nxtBtnDisabled}
            onClick={handleNextFlagClick}
          />
        </ModView>
      </Flex>
      <ModView>
        <Flex
          gap="lg"
          direction="column"
          align="center"
          justify="center"
        >
          <Text>Antwort: {currFlag?.country}</Text>

          <Button onClick={handleShowAnswerClick}>Antwort aufdecken</Button>
        </Flex>
      </ModView>
    </Flex>
  );
};

export default FlaggenGame;
