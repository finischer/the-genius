import { Button, Flex, Image, Text } from "@mantine/core";
import React from "react";
import ArrowActionButton from "~/components/shared/ArrowActionButton";
import ModView from "~/components/shared/ModView";
import { socket } from "~/hooks/useSocket";
import { useUser } from "~/hooks/useUser";
import { type IFlaggenGameProps } from "./flaggen.types";
import classes from "./flaggen.module.css";

const FlaggenGame: React.FC<IFlaggenGameProps> = ({ game }) => {
  const { isHost } = useUser();
  const displayFlag = game.display.country;
  const currFlag = game.countries[game.qIndex];
  const nxtBtnDisabled = game.qIndex >= game.countries.length - 1;
  const prevBtnDisabled = game.qIndex <= 0;

  const handleFlagClick = () => {
    if (!isHost || displayFlag) return;
    socket.emit("flaggen:showFlag");
  };

  const handleNextFlagClick = () => {
    socket.emit("hideAnswerBanner");
    socket.emit("flaggen:nextFlag");
  };

  const handlePrevFlagClick = () => {
    socket.emit("hideAnswerBanner");
    socket.emit("flaggen:prevFlag");
  };

  const handleShowAnswerClick = () => {
    if (!currFlag?.country) return;
    socket.emit("showAnswerBanner", { answer: currFlag?.country });
  };

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
