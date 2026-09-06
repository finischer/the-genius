import {
  Button,
  ButtonGroup,
  Divider,
  Flex,
  Group,
  Stack,
  Text
} from "@mantine/core";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, type FC } from "react";
import GameNavControls from "~/components/shared/GameNavControls";
import ModView from "~/components/shared/ModView";
import useSyncedRoom from "~/hooks/useSyncedRoom";
import { useUser } from "~/hooks/useUser";
import { animations } from "~/utils/animations";
import { goToNextQuestion, goToPreviousQuestion } from "~/utils/helpers";
import type { IFragenhagelGameProps } from "./fragenhagel.types";
import useFragenhagelBuzzer from "./useFragenhagelBuzzer";
import ScoreBox from "./components/ScoreBox";
import TimerBar from "./components/TimerBar";
import type { Team } from "~/types/gameshow.types";

const FragenhagelGame: FC<IFragenhagelGameProps> = ({ game }) => {
  const room = useSyncedRoom();
  const { isHost, hostFunction } = useUser();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currQuestion = game.questions.at(game.qIndex);
  const activeTeam = Object.values(room.teams).find((t) => t.isActiveTurn);
  const activePlayerId = game.activePlayerId;

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

  const handleResetTimer = hostFunction(() => {
    game.timerState.seconds = 0;
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
    game.activePlayerId = null;
    game.currentScore = 0;
    game.buzzerCount = 0;
    game.timerState.isActive = false;
    game.timerState.seconds = 0;
  });

  const handleSelectPlayer = hostFunction((playerId: string) => {
    const owningTeam = Object.values(room.teams).find((t) =>
      t.players.some((p) => p.userId === playerId)
    );
    const isAlreadyActive =
      owningTeam?.isActiveTurn && game.activePlayerId === playerId;

    Object.values(room.teams).forEach((t) => {
      const owns = t.players.some((p) => p.userId === playerId);
      t.isActiveTurn = owns ? !isAlreadyActive : false;
      t.scorebarTimer.active = false;
    });

    game.activePlayerId = isAlreadyActive ? null : playerId;
    game.buzzerCount = 0;
    game.timerState.isActive = false;
    game.timerState.seconds = 0;
  });

  const ActivePlayersView = ({ team }: { team: Team }) => {
    return (
      <Stack gap={6}>
        <Group gap="sm" align="flex-start">
          <>
            <Stack gap={4} align="center">
              <Text size="xs" c="dimmed">
                {team.name}
              </Text>
              {team.players.length === 0 ? (
                <Text size="xs" c="dimmed" fs="italic">
                  Leer
                </Text>
              ) : (
                team.players.map((p) => (
                  <Button
                    key={p.userId}
                    size="xs"
                    variant={p.userId === activePlayerId ? "filled" : "default"}
                    onClick={() => handleSelectPlayer(p.userId)}
                  >
                    {p.name}
                  </Button>
                ))
              )}
            </Stack>
          </>
        </Group>
      </Stack>
    );
  };

  const SelectPlayerListView = () => {
    return (
      <Stack gap={6}>
        <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
          Aktiven Spieler auswählen
        </Text>
        <Group gap="sm" align="flex-start">
          {Object.values(room.teams).map((team) => (
            <ActivePlayersView key={team.id} team={team} />
          ))}
        </Group>
      </Stack>
    );
  };

  const IntervalView = () => (
    <Stack gap={6}>
      <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
        Intervall
      </Text>
      <ButtonGroup>
        {game.configuredIntervals.map((interval) => {
          const isActive =
            game.intervalState.start === interval.start &&
            game.intervalState.end === interval.end;
          return (
            <Button
              key={interval.id}
              size="xs"
              variant={isActive ? "filled" : "default"}
              onClick={() => handleSetInterval(interval.start, interval.end)}
            >
              {interval.label} ({interval.start}–{interval.end}s)
            </Button>
          );
        })}
      </ButtonGroup>
    </Stack>
  );

  const TimerView = () => (
    <Stack gap={6}>
      <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
        Timer
      </Text>
      <ButtonGroup>
        <Button
          size="xs"
          variant="default"
          disabled={game.timerState.isActive}
          onClick={handleResetTimer}
        >
          Zurücksetzen
        </Button>
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
  );

  const QuestionNavigationView = () => (
    <Stack gap="xs" align="center">
      <Group justify="center" gap="sm">
        <Button size="sm" color="red" onClick={() => handleNextQuestion(false)}>
          Falsch
        </Button>
        <Button
          size="sm"
          color="green"
          onClick={() => handleNextQuestion(true)}
        >
          Richtig
        </Button>
      </Group>
      <GameNavControls
        mt="xl"
        currentIndex={game.qIndex}
        total={game.questions.length}
        onPrev={handlePrevQuestion}
        onNext={() =>
          goToNextQuestion(game.questions, game.qIndex, () => {
            game.qIndex += 1;
          })
        }
      />
    </Stack>
  );

  return (
    <AnimatePresence>
      <Stack align="center" gap="lg">
        {/* ── Moderator setup panel ── */}
        <ModView>
          <Divider orientation="vertical" />
          <TimerView />
          <Divider orientation="vertical" />
          <IntervalView />
        </ModView>

        <motion.div layout {...animations.fadeInOut}>
          {isHost ? (
            <Flex align="center" gap="md">
              <ScoreBox score={game.currentScore} />
              <TimerBar
                seconds={game.timerState.seconds}
                intervalState={game.intervalState}
              />
              <SelectPlayerListView />
            </Flex>
          ) : (
            <ScoreBox score={game.currentScore} />
          )}
        </motion.div>

        <ModView>
          <Group>
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
                </Stack>
              ) : (
                <Text c="dimmed" ta="center">
                  Keine Fragen konfiguriert
                </Text>
              )}

              <Divider />
              <QuestionNavigationView />
            </Stack>
          </Group>
        </ModView>

        {/* ── Round-end button — appears after player buzzes twice ── */}
        <ModView>
          <AnimatePresence>
            {activeTeam && game.buzzerCount >= 2 && (
              <motion.div {...animations.fadeInOut}>
                <Button
                  size="sm"
                  mb={10}
                  color={timerInInterval ? "green" : "red"}
                  onClick={handleApplyScoreToTeam}
                >
                  {timerInInterval
                    ? `✓ Runde beenden & ${game.currentScore} Pkt. an ${activeTeam.name} vergeben`
                    : `✗ Runde beenden — Timer außerhalb, 0 Pkt. für ${activeTeam.name}`}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </ModView>
      </Stack>
    </AnimatePresence>
  );
};

export default FragenhagelGame;
