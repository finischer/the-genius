import { Box, Flex, Text, useMantineTheme } from "@mantine/core";
import React from "react";
import { ANSWER_BACKGROUND_COLORS, ANSWER_SELECT_MAP } from "../../duSagst.constants";
import { DEFAULT_ANSWER_OPTION } from "../../duSagst.constants";

interface AnswerBoxProps {
  playerName: string;
  selectedAnswer: number; // index of selected answer
}

const AnswerBox: React.FC<AnswerBoxProps> = ({ selectedAnswer, playerName }) => {
  const isAnswerEmpty = selectedAnswer < 0 || selectedAnswer > 3;

  const theme = useMantineTheme();
  const { color, label } = ANSWER_SELECT_MAP[selectedAnswer] ?? DEFAULT_ANSWER_OPTION;
  const backgroundColor = ANSWER_BACKGROUND_COLORS[color];
  const labelSize = isAnswerEmpty ? "2rem" : "7rem";

  return (
    <Flex
      direction="column"
      pos="relative"
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
        w="14rem"
        justify="center"
        align="center"
        bg={backgroundColor}
        sx={{
          borderRadius: theme.radius.md,
          borderColor: isAnswerEmpty ? theme.colors.dark[4] : "transparent",
          borderStyle: "solid",
          borderTopLeftRadius: 0,
        }}
      >
        <Text
          size={labelSize}
          align="center"
        >
          {label}
        </Text>
      </Flex>
    </Flex>
  );
};

export default AnswerBox;
