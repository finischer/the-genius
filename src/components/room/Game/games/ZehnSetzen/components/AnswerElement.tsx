import { Group, Text, useMantineTheme } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import React, { type FC } from "react";
import ActionIcon from "~/components/shared/ActionIcon";
import QuestionBox from "~/components/shared/QuestionBox";
import TeamScore from "./TeamScore";
import { useUser } from "~/hooks/useUser";
import type { TZehnSetzenAnswer } from "../zehnSetzen.types";
import { MAX_SCORE, type TZehnSetzenGameState } from "../config";
import { animations } from "~/utils/animations";
import useSyncedRoom from "~/hooks/useSyncedRoom";

interface AnswerElementProps {
  answer: TZehnSetzenAnswer;
  index: number;
  showAnswer: boolean;
  game: TZehnSetzenGameState;
  hasSubmittedAnswer: boolean;
}

const INACTIVE_OPACITY = 0.5;

const AnswerElement: FC<AnswerElementProps> = ({
  answer,
  showAnswer,
  game,
  hasSubmittedAnswer,
  index
}) => {
  const theme = useMantineTheme();
  const room = useSyncedRoom();

  const { isPlayer, team, playerFunction, isHost, hostFunction } = useUser();

  const teamState = game.teamStates;
  const teamKey = team?.shortName ?? null;

  const currQuestion = game.questions.at(game.qIndex);
  const isCorrectAnswer = currQuestion?.correctAnswer?.id === answer.id;

  const inactiveOpacity = isHost ? INACTIVE_OPACITY : 0;
  const answerOpacity = showAnswer ? 1 : inactiveOpacity;
  const displayChangeScoreButtons =
    isPlayer && !hasSubmittedAnswer && showAnswer;

  const showTeamOneScore = game.display.teamScores.t1;
  const showTeamTwoScore = game.display.teamScores.t2;

  const incrementScore = (
    teamKey: keyof TZehnSetzenGameState["teamStates"] | null
  ) => {
    if (!teamKey || hasSubmittedAnswer) return;

    playerFunction(() => {
      if (teamState[teamKey].answerScores[index] == undefined) return;

      const totalScore = teamState[teamKey].answerScores.reduce(
        (acc, curr) => acc + curr,
        0
      );
      const hasReachedMaxScore = totalScore >= MAX_SCORE;

      if (hasReachedMaxScore) return;
      const currScore = teamState[teamKey].answerScores[index] ?? 0;
      const newScore = currScore + 1;
      teamState[teamKey].answerScores.splice(index, 1, newScore);
    });
  };

  const decrementScore = (
    teamKey: keyof TZehnSetzenGameState["teamStates"] | null
  ) => {
    if (!teamKey || hasSubmittedAnswer) return;

    playerFunction(() => {
      const answerScores = teamState[teamKey].answerScores;

      const currScore = answerScores.at(index) ?? 0;
      const newScore = currScore - 1;

      if (answerScores.length === 0) {
        teamState[teamKey].answerScores = [newScore];
        return;
      }

      if (currScore <= 0) {
        answerScores.splice(index, 1, 0);
        return;
      }

      answerScores.splice(index, 1, newScore);
    });
  };

  const toggleAnswer = hostFunction(() => {
    game.display.answers = game.display.answers.includes(index)
      ? game.display.answers.filter((i) => i !== index)
      : [...game.display.answers, index];
  });

  return (
    <Group key={answer.id}>
      <AnimatePresence>
        {displayChangeScoreButtons && (
          <motion.div {...animations.fadeInOut}>
            <ActionIcon onClick={() => decrementScore(teamKey)}>
              <IconMinus size={16} />
            </ActionIcon>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div layout>
        <QuestionBox
          py="xs"
          px="md"
          contentCentered={false}
          opacity={answerOpacity}
          onClick={toggleAnswer}
          bg={
            isCorrectAnswer && game.display.correctAnswer
              ? "green"
              : theme.primaryColor
          }
          style={{
            transition: "opacity 300ms, background-color 0.2s ease-in-out",
            cursor: isHost ? "pointer" : "default"
          }}
        >
          <Group justify="space-between" w="100%">
            <TeamScore
              teamId={room.teams.teamOne.id}
              isDisplayed={showTeamOneScore}
              score={teamState.t1.answerScores.at(index) ?? 0}
            />
            <Text ta="center" style={{ wordBreak: "break-word" }} maw={250}>
              {answer.answer}
            </Text>
            <TeamScore
              teamId={room.teams.teamTwo.id}
              isDisplayed={showTeamTwoScore}
              score={teamState.t2.answerScores.at(index) ?? 0}
            />
          </Group>
        </QuestionBox>
      </motion.div>
      <AnimatePresence>
        {displayChangeScoreButtons && (
          <motion.div {...animations.fadeInOut}>
            <ActionIcon onClick={() => incrementScore(teamKey)}>
              <IconPlus size={16} />
            </ActionIcon>
          </motion.div>
        )}
      </AnimatePresence>
    </Group>
  );
};

export default AnswerElement;
