import { Button, Flex, Text, useMantineTheme } from "@mantine/core";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import ContainerBox from "~/components/shared/ContainerBox";
import { useUser } from "~/hooks/useUser";
import { DUSAGST_TIME_TO_THINK_SECONDS, type TDuSagstGameState } from "../../config";
import { ANSWER_BACKGROUND_COLORS, ANSWER_SELECT_MAP, DEFAULT_ANSWER_OPTION } from "../../duSagst.constants";
import type { TDuSagstAnswer } from "../../duSagst.types";
import { useRoom } from "~/hooks/useRoom";
import { socket } from "~/hooks/useSocket";
import ModView from "~/components/shared/ModView";

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
  let allSubmitted = true;

  for (const teamValue of Object.values(teams)) {
    for (const playerValue of Object.values(teamValue)) {
      if (!playerValue.submitted) {
        allSubmitted = false;
        break;
      }
    }

    if (!allSubmitted) break;
  }

  return allSubmitted;
};

const QuestionContainer: React.FC<QuestionContainerProps> = ({ question, answerOptions, game }) => {
  const { isPlayer, isHost } = useUser();
  const { room } = useRoom();
  const theme = useMantineTheme();
  const q = question.endsWith("?") ? question : question + "?";
  const isAnswerClickable = isPlayer && !allPlayersHasSubmitted(game.teamStates);

  const AnswerRow: React.FC<AnswerRowProps> = ({ index, answer }) => {
    const theme = useMantineTheme();
    const { color, label } = ANSWER_SELECT_MAP[index] ?? DEFAULT_ANSWER_OPTION;
    const backgroundColor = ANSWER_BACKGROUND_COLORS[color];

    return (
      <Flex
        bg={backgroundColor}
        p="0.5rem 2rem"
        sx={{ borderRadius: theme.radius.sm }}
        align="center"
        gap="md"
      >
        <Text size="1.5rem">{label}</Text>
        {answer}
      </Flex>
    );
  };

  const handleStartTimer = () => {
    socket.emit("startTimer", DUSAGST_TIME_TO_THINK_SECONDS, () => {
      console.log("Submit all answers automatically!");
    });
  };

  return (
    <Flex
      direction="column"
      gap="xl"
    >
      <ContainerBox
        bg={theme.primaryColor}
        contentCentered
        w="25rem"
        py="1rem"
        px="2rem"
      >
        <Text align="center">{q}</Text>
      </ContainerBox>

      <AnimatePresence>
        <Flex
          direction="column"
          gap="sm"
          sx={{ fontWeight: "bold" }}
        >
          {answerOptions.map((a, index) => {
            const showAnswer = !game.display.answers.includes(index);
            const rotateValue = showAnswer ? 0 : 90;

            if (isHost && !showAnswer) {
              return (
                <Flex
                  p="0.5rem 2rem"
                  justify="center"
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
            <Button
              mt="xl"
              disabled={room.state.display.clock.isActive}
              onClick={handleStartTimer}
            >
              Timer starten
            </Button>
          </ModView>
        </Flex>
      </AnimatePresence>
    </Flex>
  );
};

export default QuestionContainer;
