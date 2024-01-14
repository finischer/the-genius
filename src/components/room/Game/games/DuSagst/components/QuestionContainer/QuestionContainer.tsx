import { Button, Flex, Text, useMantineTheme } from "@mantine/core";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import ContainerBox from "~/components/shared/ContainerBox";
import ModView from "~/components/shared/ModView";
import { useRoom } from "~/hooks/useRoom";
import { socket } from "~/hooks/useSocket";
import { useUser } from "~/hooks/useUser";
import { type TDuSagstGameState } from "../../config";
import { ANSWER_BACKGROUND_COLORS, ANSWER_SELECT_MAP, DEFAULT_ANSWER_OPTION } from "../../duSagst.constants";
import type { TDuSagstAnswer } from "../../duSagst.types";
import ActionIcon from "~/components/shared/ActionIcon";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

interface QuestionContainerProps {
  question: string;
  answerOptions: TDuSagstAnswer[];
  game: TDuSagstGameState;
}

interface AnswerRowProps {
  index: number;
  answer: string;
}

const allPlayersHasSubmitted = (teams: TDuSagstGameState["teamStates"]): boolean => {
  const boxes = Object.values(teams).flatMap((team) => team.boxStates);
  return boxes.every((box) => box.submitted);
};

const QuestionContainer: React.FC<QuestionContainerProps> = ({ question, answerOptions, game }) => {
  const { isPlayer, isHost, hostFunction } = useUser();
  const { room } = useRoom();
  const theme = useMantineTheme();
  const q = question.endsWith("?") ? question : question + "?";
  const allAnswersSubmitted = allPlayersHasSubmitted(game.teamStates);
  const isAnswerClickable = isPlayer && !allAnswersSubmitted;
  const allAnswersShown = answerOptions.length === game.display.answers.length;
  const isTimerActive = room.state.display.clock.isActive;
  const isPrevBtnDisabled = isTimerActive || game.qIndex <= 0;
  const isNxtBtnDisabled = isTimerActive || game.qIndex >= game.questions.length - 1;
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
    socket.emit("duSagst:startTimer", game.timeToThinkSeconds, () => {
      socket.emit("duSagst:submitAnswers");
    });
  });

  const handleShowAnswer = hostFunction((answerIndex: number) => {
    socket.emit("duSagst:showAnswer", answerIndex);
  });

  const handleClickAnswer = (answerIndex: number) => {
    if (!isPlayer || allAnswersSubmitted) return;
    socket.emit("duSagst:clickAnswer", { answerIndex });
  };

  const handleShowQuestion = hostFunction(() => {
    socket.emit("duSagst:showQuestion");
  });

  const handleNextQuestion = hostFunction(() => {
    socket.emit("duSagst:nextQuestion");
  });

  const handlePrevQuestion = hostFunction(() => {
    socket.emit("duSagst:prevQuestion");
  });

  return (
    <Flex
      direction="column"
      gap="xl"
    >
      <Flex
        direction="column"
        pos="relative"
        align="center"
        gap="md"
      >
        <ModView>
          <Button
            variant="default"
            onClick={handleShowQuestion}
            disabled={showQuestion}
          >
            Frage anzeigen
          </Button>
        </ModView>
        <ContainerBox
          bg={theme.primaryColor}
          contentCentered
          w="25rem"
          py="1rem"
          px="2rem"
          opacity={game.display.question ? 1 : questionOpacity}
          style={{
            transition: "opacity 300ms",
          }}
        >
          <Text ta="center">{q}</Text>
        </ContainerBox>
      </Flex>

      <AnimatePresence>
        <Flex
          direction="column"
          gap="sm"
          style={{ fontWeight: "bold" }}
        >
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
                  <Button variant="default">Antwort {index + 1} aufdecken</Button>
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
                <AnswerRow
                  index={index}
                  answer={a.text}
                />
              </motion.div>
            );
          })}

          <ModView>
            <Flex
              direction="column"
              gap="md"
              w="100%"
              align="center"
            >
              <Button
                mt="xl"
                disabled={isTimerActive || !allAnswersShown}
                onClick={handleStartTimer}
              >
                Timer starten
              </Button>

              <Flex gap="lg">
                <ActionIcon
                  toolTip="Vorherige Frage"
                  variant="default"
                  onClick={handlePrevQuestion}
                  disabled={isPrevBtnDisabled}
                >
                  <IconArrowLeft />
                </ActionIcon>
                <ActionIcon
                  toolTip="Nächste Frage"
                  variant="default"
                  onClick={handleNextQuestion}
                  disabled={isNxtBtnDisabled}
                >
                  <IconArrowRight />
                </ActionIcon>
              </Flex>

              <p>
                Frage {game.qIndex + 1} / {game.questions.length}
              </p>
            </Flex>
          </ModView>
        </Flex>
      </AnimatePresence>
    </Flex>
  );
};

export default QuestionContainer;
