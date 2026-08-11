import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  Group,
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

  const timerInInterval =
    game.intervalState.start !== -1 &&
    game.timerState.seconds >= game.intervalState.start &&
    game.timerState.seconds <= game.intervalState.end;

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
    Object.values(room.teams).forEach((t) => {
      t.isActiveTurn = t.id === teamId ? !t.isActiveTurn : false;
      t.scorebarTimer.active = false;
    });
  });

  return (
    <AnimatePresence>
      <Stack align="center" gap="lg">
        {/* ── Moderator setup panel ── */}
        <ModView>
          <Paper p="md" radius="md" bg="dark.7" w="100%" maw={900}>
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              {/* Aktiver Spieler */}
              <Stack gap={6}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                  Aktiver Spieler
                </Text>
                <ButtonGroup>
                  {Object.values(room.teams).map((t) => (
                    <Button
                      key={t.id}
                      size="xs"
                      variant={t.isActiveTurn ? "filled" : "default"}
                      onClick={() => handleSelectPlayer(t.id)}
                    >
                      {t.players[0]?.name ?? t.name}
                    </Button>
                  ))}
                </ButtonGroup>
              </Stack>

              <Divider orientation="vertical" />

              {/* Intervall */}
              <Stack gap={6}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                  Intervall
                </Text>
                <ButtonGroup>
                  {FRAGENHAGEL_INTERVALS.map((interval) => {
                    const isActive =
                      game.intervalState.start === interval.start &&
                      game.intervalState.end === interval.end;
                    return (
                      <Button
                        key={interval.label}
                        size="xs"
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
              </Stack>

              <Divider orientation="vertical" />

              {/* Timer */}
              <Stack gap={6}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                  Timer
                </Text>
                <ButtonGroup>
                  <Button
                    size="xs"
                    variant="default"
                    disabled={game.timerState.isActive}
                    onClick={handleStartTimer}
                  >
                    Starten
                  </Button>
                  <Button
                    size="xs"
                    variant="default"
                    disabled={!game.timerState.isActive}
                    onClick={handleStopTimer}
                  >
                    Stoppen
                  </Button>
                </ButtonGroup>
              </Stack>
            </Group>
          </Paper>
        </ModView>

        {/* ── Timer bar (host) / Score (players) ── */}
        <motion.div layout {...animations.fadeInOut}>
          {isHost ? (
            <Flex align="center" gap="md">
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

        {/* ── Question panel (moderator only) ── */}
        <ModView>
          <Paper p="md" radius="md" bg="dark.7" w="100%" maw={900}>
            <Stack gap="md">
              {/* Question text */}
              {currQuestion ? (
                <Stack gap={4}>
                  <Text fw={600} size="lg" ta="center">
                    {currQuestion.question}
                  </Text>
                  <Text c="green.4" fw={500} ta="center">
                    {currQuestion.answer}
                  </Text>
                  <Text c="dimmed" size="xs" ta="center">
                    {game.qIndex + 1} / {game.questions.length}
                  </Text>
                </Stack>
              ) : (
                <Text c="dimmed" ta="center">
                  Keine Fragen konfiguriert
                </Text>
              )}

              <Divider />

              {/* Navigation + judgement */}
              <Group justify="center" gap="sm">
                <Button
                  size="sm"
                  variant="default"
                  onClick={handlePrevQuestion}
                >
                  ← Zurück
                </Button>
                <Button
                  size="sm"
                  color="red"
                  onClick={() => handleNextQuestion(false)}
                >
                  Falsch
                </Button>
                <Button
                  size="sm"
                  color="green"
                  onClick={() => handleNextQuestion(true)}
                >
                  Richtig +1
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  onClick={() =>
                    goToNextQuestion(game.questions, game.qIndex, () => {
                      game.qIndex += 1;
                    })
                  }
                >
                  Weiter →
                </Button>
              </Group>

              {/* Round end */}
              {activeTeam && (
                <Box>
                  <Button
                    fullWidth
                    variant="light"
                    color={timerInInterval ? "blue" : "red"}
                    onClick={handleApplyScoreToTeam}
                  >
                    {timerInInterval
                      ? `${game.currentScore} Pkt. an ${activeTeam.name} vergeben & Runde beenden`
                      : `Timer außerhalb – 0 Pkt. für ${activeTeam.name} & Runde beenden`}
                  </Button>
                </Box>
              )}
            </Stack>
          </Paper>
        </ModView>
      </Stack>
    </AnimatePresence>
  );
};

export default FragenhagelGame;
