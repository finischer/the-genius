import React from "react";
import type { IDuSagstGameProps } from "./duSagst.types";
import { Flex } from "@mantine/core";
import AnswerBox from "./components/AnswerBox";
import QuestionContainer from "./components/QuestionContainer";

const DuSagstGame: React.FC<IDuSagstGameProps> = ({ game }) => {
  const currQuestion = game.questions[game.qIndex + 1];

  return (
    <Flex
      gap="xl"
      align="flex-end"
    >
      <AnswerBox
        selectedAnswer={0}
        playerName="Niklas"
      />
      <AnswerBox
        selectedAnswer={1}
        playerName="Tim"
      />
      {currQuestion && (
        <QuestionContainer
          question={currQuestion.question}
          answerOptions={currQuestion.answers}
          game={game}
        />
      )}
      <AnswerBox
        selectedAnswer={2}
        playerName="FrischerFischer"
      />
      <AnswerBox
        selectedAnswer={3}
        playerName="Oliver"
      />
      {/* <AnswerBox
        selectedAnswer={-1}
        playerName="Antonia"
      /> */}
    </Flex>
  );
};

export default DuSagstGame;
