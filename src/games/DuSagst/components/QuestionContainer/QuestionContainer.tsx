import { Button, Flex, Text, useMantineTheme } from "@mantine/core";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import GameNavControls from "~/components/shared/GameNavControls";
import ModView from "~/components/shared/ModView";
import QuestionBox from "~/components/shared/QuestionBox";
import useSyncedRoom from "~/hooks/useSyncedRoom";
import useTimer from "~/hooks/useTimer";
import { useUser } from "~/hooks/useUser";
import { TimerType } from "~/types/gameshow.types";
import { goToNextQuestion, goToPreviousQuestion } from "~/utils/helpers";
import { type TDuSagstGameState } from "../../config";
import {
  ANSWER_BACKGROUND_COLORS,
  ANSWER_SELECT_MAP,
  DEFAULT_ANSWER_OPTION
} from "../../duSagst.constants";
import type { TDuSagstAnswer } from "../../duSagst.types";

interface QuestionContainerProps {
  question: string;
  answerOptions: TDuSagstAnswer[];
  game: TDuSagstGameState;
}

interface AnswerRowProps {
  index: number;
  answer: string;
}

const QuestionContainer: React.FC<QuestionContainerProps> = ({
  question,
  answerOptions,
  game
}) => {
  const { isPlayer, isHost, hostFunction, player } = useUser();
  const room = useSyncedRoom();
  const { startTimer, active: isTimerActive } = useTimer(
    room.context.header.timer,
    TimerType.COUNTDOWN,
    game.timeToThinkSeconds
  );
  const allBoxes = Object.values(game.teamStates).flatMap(
    (team) => team.boxStates
  );

  const q = question.endsWith("?") ? question : question + "?";
  const allAnswersSubmitted = allBoxes.every((box) => box.submitted);
  const isAnswerClickable = isPlayer && !allAnswersSubmitted;
  const isPrevBtnDisabled = isTimerActive || game.qIndex <= 0;
  const isNxtBtnDisabled =
    isTimerActive || game.qIndex >= game.questions.length - 1;
  const showQuestion = game.display.question;

  const questionOpacity = isHost && !showQuestion ? 0.7 : 0;

  const AnswerRow: React.FC<AnswerRowProps> = ({ index, answer }) => {
    const theme = useMantineTheme();
    const { color, label } = ANSWER_SELECT_MAP[index] ?? DEFAULT_ANSWER_OPTION;
    const backgroundColor = ANSWER_BACKGROUND_COLORS[color];

    return (
      <Flex
        bg={backgroundColor}
        p="0.5rem 2rem"
        style={{ borderRadius: theme.radius.sm }}
        align="center"
        gap="md"
        onClick={() => handleClickAnswer(index)}
      >
        <Text size="1.5rem">{label}</Text>
        {answer}
      </Flex>
    );
  };

  const handleStartTimer = hostFunction(() => {
    unsubmitAllAnswers();

    startTimer(() => {
      submitAllAnswers();
    });
  });

  const submitAllAnswers = () => {
    allBoxes.forEach((box) => (box.submitted = true));
  };

  const unsubmitAllAnswers = () => {
    allBoxes.forEach((box) => (box.submitted = false));
  };

  const handleShowAnswer = hostFunction((answerIndex: number) => {
    game.display.answers.push(answerIndex);
  });

  const handleClickAnswer = (answerIndex: number) => {
    if (!player || allAnswersSubmitted) return;

    player.context.duSagst.answer = answerIndex;
  };

  const handleShowQuestion = hostFunction(() => {
    game.display.question = true;
  });

  const prepareQuestion = () => {
    game.display.answers = [];
    game.display.question = false;
    allBoxes.forEach((box) => {
      box.showAnswer = false;
      box.answerIndex = -1;
    });
  };

  const handleNextQuestion = hostFunction(() => {
    prepareQuestion();
    goToNextQuestion(game.questions, game.qIndex, (newIndex) => {
      game.qIndex = newIndex;
    });
  });

  const handlePrevQuestion = hostFunction(() => {
    prepareQuestion();
    goToPreviousQuestion(game.qIndex, (newIndex) => {
      game.qIndex = newIndex;
    });
  });

  return (
    <Flex direction="column" gap="xl">
      <Flex direction="column" pos="relative" align="center" gap="md">
        <ModView>
          <Button
            variant="default"
            onClick={handleShowQuestion}
            disabled={showQuestion}
          >
            Frage anzeigen
          </Button>
        </ModView>
        <QuestionBox opacity={game.display.question ? 1 : questionOpacity}>
          {q}
        </QuestionBox>
      </Flex>

      <AnimatePresence>
        <Flex direction="column" gap="sm" style={{ fontWeight: "bold" }}>
          {answerOptions.map((a, index) => {
            const showAnswer = game.display.answers.includes(index);
            const rotateValue = showAnswer ? 0 : 90;

            if (isHost && !showAnswer) {
              return (
                <Flex
                  key={a.id}
                  p="0.5rem 2rem"
                  justify="center"
                  onClick={() => handleShowAnswer(index)}
                >
                  <Button variant="default">
                    Antwort {index + 1} aufdecken
                  </Button>
                </Flex>
              );
            }

            return (
              <motion.div
                key={a.id}
                whileHover={{ opacity: isAnswerClickable ? 0.7 : 1 }}
                initial={{ opacity: 1, rotateX: 90 }}
                animate={{ opacity: 1, rotateX: rotateValue }}
                exit={{ opacity: 1, rotateX: -90 }}
                transition={{ type: "tween" }}
              >
                <AnswerRow index={index} answer={a.text} />
              </motion.div>
            );
          })}

          <ModView>
            <Flex direction="column" gap="md" w="100%" align="center">
              <Button mt="xl" onClick={handleStartTimer}>
                Timer starten
              </Button>
            </Flex>
          </ModView>

          <GameNavControls
            currentIndex={game.qIndex}
            total={game.questions.length}
            onPrev={handlePrevQuestion}
            onNext={handleNextQuestion}
            disablePrev={isPrevBtnDisabled}
            disableNext={isNxtBtnDisabled}
          />
        </Flex>
      </AnimatePresence>
    </Flex>
  );
};

export default QuestionContainer;
