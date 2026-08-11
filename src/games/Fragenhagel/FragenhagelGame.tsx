import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Paper,
  Stack,
  Text
} from "@mantine/core";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, type FC } from "react";
import ModView from "~/components/shared/ModView";
import useSyncedRoom from "~/hooks/useSyncedRoom";
import { useUser } from "~/hooks/useUser";
import { animations } from "~/utils/animations";
import { goToNextQuestion, goToPreviousQuestion } from "~/utils/helpers";
import { FRAGENHAGEL_INTERVALS } from "./config";
import type { IFragenhagelGameProps } from "./fragenhagel.types";
import useFragenhagelBuzzer from "./useFragenhagelBuzzer";
import ScoreBox from "./components/ScoreBox";
import TimerBar from "./components/TimerBar";
const FragenhagelGame: FC<IFragenhagelGameProps> = ({ game }) => {
  const room = useSyncedRoom();
  const { isHost, hostFunction } = useUser();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currQuestion = game.questions.at(game.qIndex);
  const activeTeam = Object.values(room.teams).find((t) => t.isActiveTurn);

  // Fragenhagel-specific buzzer: spacebar + game-title click toggle the timer
  useFragenhagelBuzzer(game);

  // Only the host drives the timer tick to prevent multiple clients from
  // each incrementing the shared Yjs state simultaneously.
  useEffect(() => {
    if (!isHost) return;

    if (game.timerState.isActive) {
      intervalRef.current = setInterval(() => {
        game.timerState.seconds += 1;
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [game.timerState.isActive, isHost]);

  const handleStartTimer = hostFunction(() => {
    game.timerState.isActive = true;
  });

  const handleStopTimer = hostFunction(() => {
    game.timerState.isActive = false;
  });

  const handleSetInterval = hostFunction((start: number, end: number) => {
    game.intervalState = { start, end };
  });

  const handleNextQuestion = hostFunction((correct: boolean) => {
    if (correct) {
      game.currentScore += 1;
    }
    goToNextQuestion(game.questions, game.qIndex, () => {
      game.qIndex += 1;
    });
  });

  const handlePrevQuestion = hostFunction(() => {
    goToPreviousQuestion(game.qIndex, () => {
      game.qIndex -= 1;
    });
  });

  const handleApplyScoreToTeam = hostFunction(() => {
    const timerInInterval =
      game.intervalState.start !== -1 &&
      game.timerState.seconds >= game.intervalState.start &&
      game.timerState.seconds <= game.intervalState.end;

    if (activeTeam) {
      activeTeam.gameScore += timerInInterval ? game.currentScore : 0;
      activeTeam.isActiveTurn = false;
      activeTeam.scorebarTimer.active = false;
    }
    game.currentScore = 0;
    game.buzzerCount = 0;
    game.timerState.isActive = false;
    game.timerState.seconds = 0;
    game.qIndex = 0;
  });

  const handleSelectPlayer = hostFunction((teamId: string) => {
    // Toggle: clicking the already-active team deselects it
    Object.values(room.teams).forEach((t) => {
      t.isActiveTurn = t.id === teamId ? !t.isActiveTurn : false;
      t.scorebarTimer.active = false;
    });
  });

  return (
    <AnimatePresence>
      <Stack align="center" gap="xl">
        {/* Host sees score + timer bar; players only see the score */}
        <motion.div layout {...animations.fadeInOut}>
          {isHost ? (
            <Flex align="center" gap="md" w="100%">
              <ScoreBox score={game.currentScore} />
              <TimerBar
                seconds={game.timerState.seconds}
                intervalState={game.intervalState}
              />
            </Flex>
          ) : (
            <ScoreBox score={game.currentScore} />
          )}
        </motion.div>

        {/* Moderator controls */}
        <ModView>
          <Stack align="center" gap="md">
            {/* Active player picker */}
            <Stack gap="xs" align="center">
              <Text size="sm" c="dimmed">
                Aktiver Spieler
              </Text>
              <ButtonGroup>
                {Object.values(room.teams).map((t) => (
                  <Button
                    key={t.id}
                    variant={t.isActiveTurn ? "filled" : "default"}
                    onClick={() => handleSelectPlayer(t.id)}
                  >
                    {t.players[0]?.name ?? t.name}
                  </Button>
                ))}
              </ButtonGroup>
            </Stack>
            {/* Interval buttons */}
            <ButtonGroup>
              {FRAGENHAGEL_INTERVALS.map((interval) => {
                const isActive =
                  game.intervalState.start === interval.start &&
                  game.intervalState.end === interval.end;
                return (
                  <Button
                    key={interval.label}
                    variant={isActive ? "filled" : "default"}
                    onClick={() =>
                      handleSetInterval(interval.start, interval.end)
                    }
                  >
                    {interval.label}
                  </Button>
                );
              })}
            </ButtonGroup>

            {/* Timer controls */}
            <ButtonGroup>
              <Button
                variant="default"
                disabled={game.timerState.isActive}
                onClick={handleStartTimer}
              >
                Timer starten
              </Button>
              <Button
                variant="default"
                disabled={!game.timerState.isActive}
                onClick={handleStopTimer}
              >
                Timer stoppen
              </Button>
            </ButtonGroup>

            {/* Current question display */}
            {currQuestion && (
              <Paper
                p="md"
                radius="md"
                bg="dark.6"
                w="100%"
                style={{ maxWidth: 700 }}
              >
                <Stack gap="xs">
                  <Text fw={600} size="lg" ta="center">
                    {currQuestion.question}
                  </Text>
                  <Text c="green.4" fw={500} ta="center">
                    Antwort: {currQuestion.answer}
                  </Text>
                  <Text c="dimmed" size="sm" ta="center">
                    Frage {game.qIndex + 1} / {game.questions.length}
                  </Text>
                </Stack>
              </Paper>
            )}

            {/* Question navigation + answer judgement */}
            <Flex gap="md" align="center">
              <Button variant="default" onClick={handlePrevQuestion}>
                Vorherige Frage
              </Button>
              <Button color="red" onClick={() => handleNextQuestion(false)}>
                Falsch
              </Button>
              <Button color="green" onClick={() => handleNextQuestion(true)}>
                Richtig (+1)
              </Button>
            </Flex>

            {/* Apply score to active team */}
            {activeTeam && (
              <Box>
                {(() => {
                  const timerInInterval =
                    game.intervalState.start !== -1 &&
                    game.timerState.seconds >= game.intervalState.start &&
                    game.timerState.seconds <= game.intervalState.end;
                  const pointsToGive = timerInInterval ? game.currentScore : 0;
                  return (
                    <Button
                      variant="light"
                      color={timerInInterval ? "blue" : "red"}
                      onClick={handleApplyScoreToTeam}
                    >
                      {timerInInterval
                        ? `${pointsToGive} Pkt. an ${activeTeam.name} vergeben & Runde beenden`
                        : `Timer außerhalb – 0 Pkt. für ${activeTeam.name} & Runde beenden`}
                    </Button>
                  );
                })()}
              </Box>
            )}
          </Stack>
        </ModView>
      </Stack>
    </AnimatePresence>
  );
};

export default FragenhagelGame;
