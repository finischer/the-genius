import { Avatar, Container, Flex, Text, useMantineTheme } from "@mantine/core";
import type { TeamAvatarImage } from "@prisma/client";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import React from "react";
import ActionIcon from "~/components/shared/ActionIcon/ActionIcon";
import ModView from "~/components/shared/ModView";
import useAudio from "~/hooks/useAudio";
import { useRoom } from "~/hooks/useRoom";
import { socket } from "~/hooks/useSocket";
import type { IScoreboardProps } from "./scoreboard.types";

const SCOREBOARD_BORDER_BACKGROUND_COLOR = "#7b68ee";
const SCOREBOARD_BACKGROUND_COLOR = "#D8BFD8";
const DIVIDER_COLOR = "#f7f1f1";

const Scoreboard: React.FC<IScoreboardProps> = ({ team, color }) => {
  const theme = useMantineTheme();
  const { room } = useRoom();
  const { triggerAudioEvent } = useAudio();
  const avatarImages: TeamAvatarImage[] | string[] =
    team.avatarImageList.length === 0 ? Array(1).fill(team.avatarImage) : team.avatarImageList;

  const minNumOfGamesToWin = Math.round((room.games.length + 1) / 2);

  const GREEN_GRADIENT = theme.fn.linearGradient(90, "#00C9FF", "#92FE9D");
  const RED_GRADIENT = theme.fn.linearGradient(90, "#D53369", "#DAAE51");

  const lineElements = new Array(minNumOfGamesToWin).fill(null).map((_, index) => (
    <Container
      p={0}
      key={index}
      m="1.2rem 0"
      w="12rem"
      opacity={0.8}
      style={{
        borderRight: index + 1 < minNumOfGamesToWin ? `1px solid ${DIVIDER_COLOR}` : "none",
      }}
    />
  ));

  const scoreColor = color === "green" ? GREEN_GRADIENT : RED_GRADIENT;

  const increaseScore = () => {
    if (team.totalScore >= minNumOfGamesToWin) return;
    socket.emit("increaseTotalScore", { teamId: team.id, step: 1 });
    triggerAudioEvent("playSound", "shimmer");
  };

  const decreaseScore = () => {
    if (team.totalScore <= 0) return;
    socket.emit("decreaseTotalScore", { teamId: team.id, step: 1 });
    triggerAudioEvent("playSound", "shimmer");
  };

  return (
    <Flex
      h="10rem"
      align="center"
      p="2rem"
    >
      <Flex
        align="center"
        gap="xl"
      >
        <Flex
          direction="column"
          gap="md"
          align="center"
          justify="center"
          w="10rem"
          pos="relative"
        >
          <Text
            color="white"
            p="0 1rem"
            fw="bold"
            pos="absolute"
            top={-35}
          >
            {team.name}
          </Text>
          <Avatar.Group spacing="xl">
            {avatarImages.map((avatar, index) => {
              const key = typeof avatar === "object" ? avatar.userId : index;
              const img = typeof avatar === "object" ? avatar.img : avatar;

              return (
                <Avatar
                  key={key}
                  src={img}
                  radius="100px"
                  size="xl"
                  variant="filled"
                />
              );
            })}
          </Avatar.Group>
        </Flex>

        <Flex
          bg={SCOREBOARD_BACKGROUND_COLOR}
          h="7rem"
          ml="2rem"
          pos="relative"
          style={{
            border: `1px solid ${SCOREBOARD_BORDER_BACKGROUND_COLOR}`,
            borderRadius: "100px",
            overflow: "hidden",
          }}
        >
          <Flex
            h="100%"
            bg="red"
            style={{ borderRadius: "100px" }}
          />
          {lineElements}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
            }}
          />
          <Container
            p={0}
            h="100%"
            w={`calc(${team.totalScore} * (100% / ${lineElements.length}) )`}
            bg={scoreColor}
            pos="absolute"
            top={0}
            bottom={0}
            left={0}
            style={{
              borderRadius: "100px",
              transition: "width 2s",
            }}
          />
        </Flex>

        <ModView>
          <Flex
            direction="column"
            gap="md"
          >
            <ActionIcon
              variant="outline"
              onClick={increaseScore}
            >
              <IconPlus />
            </ActionIcon>
            <ActionIcon
              variant="outline"
              onClick={decreaseScore}
            >
              <IconMinus />
            </ActionIcon>
          </Flex>
        </ModView>
      </Flex>
    </Flex>
  );
};

export default Scoreboard;
