import { Flex } from "@mantine/core";
import React from "react";
import { useRoom } from "~/hooks/useRoom";
import AnswerBox from "./components/AnswerBox";
import QuestionContainer from "./components/QuestionContainer";
import type { IDuSagstGameProps } from "./duSagst.types";

const DuSagstGame: React.FC<IDuSagstGameProps> = ({ game }) => {
  const { room } = useRoom();
  const currQuestion = game.questions[game.qIndex];

  const t1BoxStates = game.teamStates.t1.boxStates;
  const t2BoxStates = game.teamStates.t2.boxStates;

  return (
    <Flex
      gap="xl"
      align="flex-end"
    >
      {/* Team One answer boxes */}
      {t1BoxStates.map((box, index) => {
        const player = room.teams.teamOne.players.at(index);
        return (
          <AnswerBox
            key={box.id}
            playerId={player?.userId ?? ""}
            selectedAnswer={player?.shared.duSagst.answer ?? -1}
            playerName={player?.name ?? "-"}
            boxState={box}
          />
        );
      })}

      {currQuestion && (
        <QuestionContainer
          question={currQuestion.question}
          answerOptions={currQuestion.answers}
          game={game}
        />
      )}

      {/* Team Two answer boxes */}
      {t2BoxStates.map((box, index) => {
        const player = room.teams.teamTwo.players.at(index);
        return (
          <AnswerBox
            key={box.id}
            playerId={player?.userId ?? ""}
            selectedAnswer={player?.shared.duSagst.answer ?? -1}
            playerName={player?.name ?? "-"}
            boxState={box}
          />
        );
      })}
    </Flex>
  );
};

export default DuSagstGame;
