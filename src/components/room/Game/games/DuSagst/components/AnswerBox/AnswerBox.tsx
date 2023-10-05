import { Box, Button, Flex, Text, useMantineTheme } from "@mantine/core";
import React from "react";
import ModView from "~/components/shared/ModView";
import { socket } from "~/hooks/useSocket";
import { useUser } from "~/hooks/useUser";
import { ANSWER_BACKGROUND_COLORS, ANSWER_SELECT_MAP, DEFAULT_ANSWER_OPTION } from "../../duSagst.constants";
import type { TDuSagstAnswerBoxState } from "../../duSagst.types";

interface AnswerBoxProps {
  playerId: string;
  playerName: string;
  selectedAnswer: number; // index of selected answer
  boxState: TDuSagstAnswerBoxState;
}

const AnswerBox: React.FC<AnswerBoxProps> = ({ selectedAnswer, playerName, playerId, boxState }) => {
  const isAnswerEmpty = selectedAnswer < 0 || selectedAnswer > 3;

  const theme = useMantineTheme();
  const { user, isPlayer, isHost } = useUser();

  const { color, label } = ANSWER_SELECT_MAP[selectedAnswer] ?? DEFAULT_ANSWER_OPTION;
  const backgroundColor = ANSWER_BACKGROUND_COLORS[color];
  const labelSize = isAnswerEmpty ? "2rem" : "7rem";

  const showAnswerBox = playerId === user.id || !isPlayer || boxState.showAnswer;
  const defaultOpacity = !boxState.showAnswer && isHost ? 0.7 : 1;

  const description = boxState.answerTheQuestion ? "Beantwortet die Frage" : "Schätzt Teampartner ein"; // TODO: Replace 'Teampartner' with actually playername

  const handleShowAnswerBox = () => {
    socket.emit("duSagst:showAnswerBox", { boxId: boxState.id });
  };

  return (
    <Flex
      direction="column"
      pos="relative"
      w="14rem"
    >
      <Flex
        direction="column"
        opacity={showAnswerBox ? defaultOpacity : 0}
        sx={{
          transition: "opacity 300ms",
        }}
      >
        <Box
          bg={theme.colors.dark[4]}
          pl="xs"
          pr="lg"
          maw="7rem"
          sx={{
            borderRadius: theme.radius.sm,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            whiteSpace: "nowrap",
          }}
        >
          <Text
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {playerName}
          </Text>
        </Box>
        <Flex
          h="14rem"
          w="inherit"
          justify="center"
          align="center"
          bg={backgroundColor}
          sx={{
            borderRadius: theme.radius.md,
            borderColor: isAnswerEmpty ? theme.colors.dark[4] : "transparent",
            borderStyle: "solid",
            borderTopLeftRadius: 0,
            transition: "background 300ms",
          }}
        >
          <Text
            size={labelSize}
            align="center"
          >
            {label}
          </Text>
        </Flex>

        <Text
          align="center"
          my="md"
          w="100%"
        >
          {description}
        </Text>
      </Flex>

      <ModView>
        <Button.Group sx={{ alignSelf: "center" }}>
          <Button
            variant="default"
            onClick={handleShowAnswerBox}
            disabled={boxState.showAnswer}
          >
            Antwort aufdecken
          </Button>
        </Button.Group>
      </ModView>
    </Flex>
  );
};

export default AnswerBox;
