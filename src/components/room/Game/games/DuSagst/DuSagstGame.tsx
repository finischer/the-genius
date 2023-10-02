import React from "react";
import type { IDuSagstGameProps } from "./duSagst.types";
import { Flex } from "@mantine/core";
import AnswerBox from "./components/AnswerBox";

const DuSagstGame: React.FC<IDuSagstGameProps> = ({ game }) => {
  return (
    <Flex gap="xl">
      <AnswerBox selectedAnswer={0} />
      <AnswerBox selectedAnswer={1} />
      <AnswerBox selectedAnswer={2} />
      <AnswerBox selectedAnswer={3} />
      <AnswerBox selectedAnswer={-1} />
    </Flex>
  );
};

export default DuSagstGame;
