import { Flex } from "@mantine/core";
import { IconSwitchHorizontal } from "@tabler/icons-react";
import React, { useEffect } from "react";
import ActionIcon from "~/components/shared/ActionIcon";
import ModView from "~/components/shared/ModView";
import { useRoom } from "~/hooks/useRoom";
import { socket } from "~/hooks/useSocket";
import type { TeamOptions } from "~/pages/api/classes/Room/room.types";
import AnswerBox from "./components/AnswerBox";
import QuestionContainer from "./components/QuestionContainer";
import type { IDuSagstGameProps, TDuSagstAnswerBoxState } from "./duSagst.types";

const TeamBox = ({ teamBoxes, team }: { teamBoxes: TDuSagstAnswerBoxState[]; team: TeamOptions }) => {
  const { room } = useRoom();

  const handleSwitchRoles = () => {
    socket.emit("duSagst:switchRoles", { boxes: teamBoxes });
  };

  return (
    <Flex
      direction="column"
      gap="xl"
      align="center"
    >
      <Flex gap="xl">
        {teamBoxes.map((box, index) => {
          const player = room.teams[team].players.at(index);
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

      <ModView>
        <ActionIcon
          toolTip="Rollen tauschen"
          variant="default"
          onClick={handleSwitchRoles}
        >
          <IconSwitchHorizontal />
        </ActionIcon>
      </ModView>
    </Flex>
  );
};

const DuSagstGame: React.FC<IDuSagstGameProps> = ({ game }) => {
  const currQuestion = game.questions[game.qIndex];

  const t1BoxStates = game.teamStates.t1.boxStates;
  const t2BoxStates = game.teamStates.t2.boxStates;

  return (
    <Flex
      gap={70}
      align="flex-end"
    >
      {/* Team One answer boxes */}
      <TeamBox
        teamBoxes={t1BoxStates}
        team="teamOne"
      />

      {currQuestion && (
        <QuestionContainer
          question={currQuestion.question}
          answerOptions={currQuestion.answers}
          game={game}
        />
      )}

      {/* Team Two answer boxes */}
      <TeamBox
        teamBoxes={t2BoxStates}
        team="teamTwo"
      />
    </Flex>
  );
};

export default DuSagstGame;
