/**
 * Beispiel Spiel - Game Component
 *
 * Die Hauptkomponente für das Beispiel-Spiel
 */

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Text,
  Button,
  Stack,
  Group,
  Badge,
  Progress,
  Center,
  ActionIcon,
  Divider
} from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconEye,
  IconEyeOff
} from "@tabler/icons-react";
import { type IGameProps } from "../../games/core/types";
import { type TExampleGameGameState } from "./config";

interface ExampleGameGameProps extends IGameProps {
  game: TExampleGameGameState;
}

const ExampleGameGame: React.FC<ExampleGameGameProps> = ({ game }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(
    game.timeSettings.thinkingTimeSeconds
  );
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const currentQuestion = game.questions[currentQuestionIndex];
  const hasNextQuestion = currentQuestionIndex < game.questions.length - 1;
  const hasPreviousQuestion = currentQuestionIndex > 0;
  const progress = ((currentQuestionIndex + 1) / game.questions.length) * 100;

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            if (game.autoShowAnswer) {
              setIsAnswerVisible(true);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining, game.autoShowAnswer]);

  const startTimer = () => {
    setTimeRemaining(game.timeSettings.thinkingTimeSeconds);
    setIsTimerRunning(true);
    setIsAnswerVisible(false);
  };

  const toggleAnswer = () => {
    setIsAnswerVisible(!isAnswerVisible);
  };

  const nextQuestion = () => {
    if (hasNextQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setIsAnswerVisible(false);
      setIsTimerRunning(false);
      setTimeRemaining(game.timeSettings.thinkingTimeSeconds);
    }
  };

  const previousQuestion = () => {
    if (hasPreviousQuestion) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setIsAnswerVisible(false);
      setIsTimerRunning(false);
      setTimeRemaining(game.timeSettings.thinkingTimeSeconds);
    }
  };

  if (!currentQuestion) {
    return (
      <Center h={400}>
        <Text size="xl" c="dimmed">
          Keine Fragen verfügbar
        </Text>
      </Center>
    );
  }

  return (
    <Stack gap="lg" p="md">
      {/* Header mit Fortschritt */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="sm">
          <Badge size="lg" variant="light">
            Frage {currentQuestionIndex + 1} von {game.questions.length}
          </Badge>
          <Badge color="blue" variant="filled">
            {game.gameMode}
          </Badge>
          <Badge
            color={
              game.difficulty === "easy"
                ? "green"
                : game.difficulty === "medium"
                  ? "yellow"
                  : "red"
            }
            variant="light"
          >
            {game.difficulty === "easy"
              ? "Leicht"
              : game.difficulty === "medium"
                ? "Mittel"
                : "Schwer"}
          </Badge>
        </Group>

        <Progress value={progress} size="sm" radius="xl" />
        <Text size="xs" c="dimmed" mt="xs" ta="center">
          {Math.round(progress)}% abgeschlossen
        </Text>
      </Card>

      {/* Timer */}
      {game.gameMode === "thinking-time" && (
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Group justify="space-between" align="center">
            <Text fw={500}>Timer</Text>
            <Group gap="xs">
              <Text size="lg" fw={700} c={timeRemaining <= 5 ? "red" : "blue"}>
                {timeRemaining}s
              </Text>
              <Button size="xs" onClick={startTimer} disabled={isTimerRunning}>
                {isTimerRunning ? "Läuft..." : "Start"}
              </Button>
            </Group>
          </Group>
        </Card>
      )}

      {/* Frage */}
      <Card shadow="sm" padding="xl" radius="md" withBorder h={200}>
        <Stack gap="sm" h="100%">
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Frage
            </Text>
            <Badge variant="outline" size="sm">
              {currentQuestion.points}{" "}
              {currentQuestion.points === 1 ? "Punkt" : "Punkte"}
            </Badge>
          </Group>

          <Center flex={1}>
            <Text size="xl" ta="center" fw={500}>
              {currentQuestion.text}
            </Text>
          </Center>
        </Stack>
      </Card>

      {/* Antwort */}
      {isAnswerVisible && (
        <Card shadow="sm" padding="lg" radius="md" withBorder bg="green.0">
          <Center>
            <Stack gap="xs" align="center">
              <Text size="sm" c="green.7" fw={500}>
                ANTWORT
              </Text>
              <Text size="lg" ta="center" fw={600} c="green.8">
                {currentQuestion.answer}
              </Text>
            </Stack>
          </Center>
        </Card>
      )}

      <Divider />

      {/* Controls */}
      <Group justify="center" gap="md">
        <ActionIcon
          variant="outline"
          size="lg"
          onClick={previousQuestion}
          disabled={!hasPreviousQuestion}
        >
          <IconChevronLeft size={18} />
        </ActionIcon>

        <Button
          leftSection={
            isAnswerVisible ? <IconEyeOff size={16} /> : <IconEye size={16} />
          }
          onClick={toggleAnswer}
          color={isAnswerVisible ? "gray" : "green"}
        >
          {isAnswerVisible ? "Antwort verstecken" : "Antwort zeigen"}
        </Button>

        <ActionIcon
          variant="outline"
          size="lg"
          onClick={nextQuestion}
          disabled={!hasNextQuestion}
        >
          <IconChevronRight size={18} />
        </ActionIcon>
      </Group>

      {/* Game Stats */}
      <Box ta="center" mt="md">
        <Text size="sm" c="dimmed">
          Modus: {game.gameMode} | Denkzeit:{" "}
          {game.timeSettings.thinkingTimeSeconds}s | Auto-Antwort:{" "}
          {game.autoShowAnswer ? "An" : "Aus"}
        </Text>
      </Box>
    </Stack>
  );
};

export default ExampleGameGame;
