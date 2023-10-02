import { Flex, Text, useMantineTheme } from "@mantine/core";
import React from "react";
import ContainerBox from "~/components/shared/ContainerBox";
import { ANSWER_BACKGROUND_COLORS, ANSWER_SELECT_MAP, DEFAULT_ANSWER_OPTION } from "../../duSagst.constants";
import type { TDuSagstAnswer } from "../../duSagst.types";

interface QuestionContainerProps {
  question: string;
  answerOptions: TDuSagstAnswer[];
}

interface AnswerRowProps {
  index: number;
  answer: string;
}

const AnswerRow: React.FC<AnswerRowProps> = ({ index, answer }) => {
  const theme = useMantineTheme();
  const { color, label } = ANSWER_SELECT_MAP[index] ?? DEFAULT_ANSWER_OPTION;
  const backgroundColor = ANSWER_BACKGROUND_COLORS[color];

  return (
    <Flex
      bg={backgroundColor}
      p="0.5rem 2rem"
      sx={{ borderRadius: theme.radius.sm }}
      align="center"
      gap="md"
    >
      <Text size="1.5rem">{label}</Text>
      {answer}
    </Flex>
  );
};

const QuestionContainer: React.FC<QuestionContainerProps> = ({ question, answerOptions }) => {
  const theme = useMantineTheme();

  return (
    <Flex
      direction="column"
      gap="xl"
    >
      <ContainerBox
        bg={theme.primaryColor}
        contentCentered
        px="3rem"
        py="sm"
      >
        <Text>{question}</Text>
      </ContainerBox>

      <Flex
        direction="column"
        gap="sm"
        sx={{ fontWeight: "bold" }}
      >
        {answerOptions.map((a, index) => (
          <AnswerRow
            key={a.id}
            index={index}
            answer={a.text}
          />
        ))}
      </Flex>
    </Flex>
  );
};

export default QuestionContainer;
