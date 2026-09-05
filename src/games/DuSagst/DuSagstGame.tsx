import { Flex } from "@mantine/core";
import { IconSwitchHorizontal } from "@tabler/icons-react";
import React from "react";
import ActionIcon from "~/components/shared/ActionIcon";
import ModView from "~/components/shared/ModView";
import useSyncedRoom from "~/hooks/useSyncedRoom";
import type { TeamOptions } from "~/server/classes/Room/room.types";
import AnswerBox from "./components/AnswerBox";
import QuestionContainer from "./components/QuestionContainer";
import type {
  IDuSagstGameProps,
  TDuSagstAnswerBoxState
} from "./duSagst.types";

const TeamBox = ({
  teamBoxes,
  team
}: {
  teamBoxes: TDuSagstAnswerBoxState[];
  team: TeamOptions;
}) => {
  const room = useSyncedRoom();

  const handleSwitchRoles = () => {
    teamBoxes.forEach((box) => {
      box.answerTheQuestion = !box.answerTheQuestion;
    });
  };

  return (
    <Flex direction="column" gap="xl" align="center">
      <Flex gap="xl">
        {teamBoxes.map((box, index) => {
          type TTeamWithPlayers = {
            players: {
              userId: string;
              context: { duSagst: { answer: number } };
              name: string;
            }[];
          };
          const teamsMap = room.teams as Record<string, TTeamWithPlayers>;
          const teamKey = team as string;
          const teamPlayers = teamsMap[teamKey]?.players ?? [];
          const player = teamPlayers.at(index);

          return (
            <AnswerBox
              key={box.id}
              playerId={player?.userId ?? ""}
              selectedAnswer={player?.context.duSagst.answer ?? -1}
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
    <Flex gap={70} align="flex-end">
      {/* Team One answer boxes */}
      <TeamBox teamBoxes={t1BoxStates} team="teamOne" />

      {currQuestion && (
        <QuestionContainer
          question={currQuestion.question}
          answerOptions={currQuestion.answers}
          game={game}
        />
      )}

      {/* Team Two answer boxes */}
      <TeamBox teamBoxes={t2BoxStates} team="teamTwo" />
    </Flex>
  );
};

export default DuSagstGame;
