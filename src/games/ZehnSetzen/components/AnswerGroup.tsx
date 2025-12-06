import React, { type FC } from "react";
import type { TZehnSetzenQuestion } from "../zehnSetzen.types";
import { MAX_SCORE, type TZehnSetzenGameState } from "../config";
import AnswerElement from "./AnswerElement";
import { useUser } from "~/hooks/useUser";
import { animations } from "~/utils/animations";
import { Button, Group, Stack } from "@mantine/core";
import { motion } from "framer-motion";
import { displayObject } from "~/utils/helpers";
import ModView from "~/components/shared/ModView";
import TeamModButtons from "./TeamModButtons";
import useSyncedRoom from "~/hooks/useSyncedRoom";

interface AnswerGroupProps {
  question: TZehnSetzenQuestion | undefined;
  game: TZehnSetzenGameState;
  hasSubmittedAnswer: boolean;
}

const AnswerGroup: FC<AnswerGroupProps> = ({
  game,
  question,
  hasSubmittedAnswer
}) => {
  const room = useSyncedRoom();
  const teamState = game.teamStates;
  const { isPlayer, team, playerFunction } = useUser();

  const displaySubmitButton =
    isPlayer &&
    team?.shortName &&
    teamState[team.shortName].answerScores.reduce(
      (acc, curr) => acc + curr,
      0
    ) === MAX_SCORE;

  const answerElements = question?.answers.map((answer, index) => {
    const showAnswer = game.display.answers.includes(index);

    return (
      <AnswerElement
        key={index}
        index={index}
        answer={answer}
        game={game}
        showAnswer={showAnswer}
        hasSubmittedAnswer={hasSubmittedAnswer}
      />
    );
  });

  const handleSubmitAnswer = () => {
    if (!team?.shortName) return;
    displayObject(teamState[team.shortName].answerScores);

    playerFunction(() => {
      teamState[team.shortName].submitted = true;
    });
  };

  return (
    <Group>
      <ModView>
        <TeamModButtons team={room.teams.teamOne} game={game} />
      </ModView>

      <Stack align="center">
        {answerElements}
        {displaySubmitButton && (
          <motion.div {...animations.fadeInOut} transition={{ delay: 0.2 }}>
            <Button
              disabled={hasSubmittedAnswer}
              variant="default"
              onClick={handleSubmitAnswer}
            >
              Submit
            </Button>
          </motion.div>
        )}
      </Stack>

      <ModView>
        <TeamModButtons team={room.teams.teamTwo} game={game} />
      </ModView>
    </Group>
  );
};

export default AnswerGroup;
