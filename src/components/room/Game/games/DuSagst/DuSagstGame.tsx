import React, { useEffect } from "react";
import type { IDuSagstGameProps } from "./duSagst.types";
import { Flex } from "@mantine/core";
import AnswerBox from "./components/AnswerBox";
import QuestionContainer from "./components/QuestionContainer";
import { useRoom } from "~/hooks/useRoom";

const DuSagstGame: React.FC<IDuSagstGameProps> = ({ game }) => {
  const { room } = useRoom();
  const currQuestion = game.questions[game.qIndex + 1];

  const { teamOne, teamTwo } = room.teams;

  return (
    <Flex
      gap="xl"
      align="flex-end"
    >
      {/* Team One answer boxes */}
      {teamOne.players.map((p) => (
        <AnswerBox
          key={p.id}
          selectedAnswer={p.shared.duSagst.answer ?? -1}
          playerName={p.name ?? "-"}
        />
      ))}

      {currQuestion && (
        <QuestionContainer
          question={currQuestion.question}
          answerOptions={currQuestion.answers}
          game={game}
        />
      )}

      {/* Team Two answer boxes */}
      {teamTwo.players.map((p) => (
        <AnswerBox
          key={p.id}
          selectedAnswer={p.shared.duSagst.answer ?? -1}
          playerName={p.name ?? "-"}
        />
      ))}
    </Flex>
  );
};

export default DuSagstGame;
