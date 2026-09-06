import React, { type FC } from "react";
import type { TZehnSetzenQuestion } from "../zehnSetzen.types";
import { MAX_SCORE, type TZehnSetzenGameState } from "../config";
import AnswerElement from "./AnswerElement";
import { useUser } from "~/hooks/useUser";
import { animations } from "~/utils/animations";
import { Box, Button, Group, Stack } from "@mantine/core";
import { motion } from "framer-motion";
import { displayObject } from "~/utils/helpers";
import ModToggle from "~/components/shared/ModToggle";
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

    const handleToggleAnswer = () => {
      if (showAnswer) {
        game.display.answers = game.display.answers.filter((i) => i !== index);
      } else {
        game.display.answers = [...game.display.answers, index];
      }
    };

    return (
      <ModToggle
        key={answer.id}
        label={`Antwort ${index + 1}`}
        visible={showAnswer}
        onToggle={handleToggleAnswer}
      >
        <AnswerElement
          index={index}
          answer={answer}
          game={game}
          showAnswer={showAnswer}
          hasSubmittedAnswer={hasSubmittedAnswer}
        />
      </ModToggle>
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
    <Group wrap="nowrap" align="flex-start" gap="xl" justify="center">
      <Box w={200} style={{ flexShrink: 0 }}>
        <ModView>
          <TeamModButtons team={room.teams.teamOne} game={game} />
        </ModView>
      </Box>

      <Stack align="center" style={{ flexShrink: 0 }}>
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

      <Box w={200} style={{ flexShrink: 0 }}>
        <ModView>
          <TeamModButtons team={room.teams.teamTwo} game={game} />
        </ModView>
      </Box>
    </Group>
  );
};

export default AnswerGroup;
