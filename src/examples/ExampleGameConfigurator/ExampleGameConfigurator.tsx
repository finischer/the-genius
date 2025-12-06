/**
 * Beispiel Spiel - Konfigurator mit useGameshowConfig Hook
 *
 * Zeigt wie man den useGameshowConfig Hook korrekt verwendet
 */

import React from "react";
import {
  Stack,
  Card,
  Text,
  Group,
  Button,
  TextInput,
  Select,
  NumberInput,
  Switch,
  MultiSelect,
  ActionIcon,
  Box,
  Badge,
  Divider
} from "@mantine/core";
import { IconTrash, IconPlus } from "@tabler/icons-react";
// Import des useGameshowConfig Hooks
import { useGameshowConfig } from "../../hooks/useGameshowConfig/useGameshowConfig";
// Hier würde normalerweise Game.EXAMPLE_GAME stehen
// import { Game } from "../../games";
import { type IExampleGameQuestion } from "../ExampleGame/examplegame.types";

// Simuliertes Game Enum für das Beispiel
const EXAMPLE_GAME_ID = "exampleGame" as any;

interface ExampleGameConfiguratorProps {
  // Der Konfigurator kann optional Props erhalten, verwendet aber hauptsächlich den Hook
}

const ExampleGameConfigurator: React.FC<ExampleGameConfiguratorProps> = () => {
  // 🎯 HIER IST DER WICHTIGE TEIL: useGameshowConfig Hook
  const { updateGame, [EXAMPLE_GAME_ID]: gameState } =
    useGameshowConfig(EXAMPLE_GAME_ID);

  // Hilfsfunktion für State-Updates
  const updateGameState = (updates: any) => {
    updateGame((draft: any) => {
      Object.assign(draft, updates);
    });
  };

  // Event Handler für Fragen
  const addQuestion = () => {
    const newQuestion: IExampleGameQuestion = {
      id: Date.now().toString(),
      text: "",
      answer: "",
      points: 1
    };

    updateGameState({
      questions: [...(gameState?.questions || []), newQuestion]
    });
  };

  const updateQuestion = (
    index: number,
    updatedQuestion: Partial<IExampleGameQuestion>
  ) => {
    if (!gameState?.questions) return;

    const newQuestions = [...gameState.questions];
    const currentQuestion = newQuestions[index];
    if (currentQuestion) {
      newQuestions[index] = { ...currentQuestion, ...updatedQuestion };
      updateGameState({ questions: newQuestions });
    }
  };

  const removeQuestion = (index: number) => {
    if (!gameState?.questions) return;

    const newQuestions = gameState.questions.filter((_, i) => i !== index);
    updateGameState({ questions: newQuestions });
  };

  // Fallback falls gameState nicht verfügbar ist
  if (!gameState) {
    return (
      <Box ta="center" py="xl">
        <Text c="dimmed">Game State wird geladen...</Text>
      </Box>
    );
  }

  return (
    <Stack gap="lg">
      {/* Info über useGameshowConfig Hook */}
      <Card withBorder bg="blue.0">
        <Text fw={600} mb="sm" c="blue.8">
          🎯 useGameshowConfig Hook Beispiel
        </Text>
        <Text size="sm" c="blue.7">
          Dieser Konfigurator zeigt, wie der useGameshowConfig Hook verwendet
          wird. Alle Änderungen werden automatisch im Gameshow-State
          gespeichert.
        </Text>
      </Card>

      {/* Grundeinstellungen */}
      <Card withBorder>
        <Text fw={600} mb="md">
          Grundeinstellungen
        </Text>
        <Stack gap="md">
          <Group grow>
            <Select
              label="Spielmodus"
              value={gameState.gameMode}
              onChange={(value) => updateGameState({ gameMode: value })}
              data={[
                { value: "rapid-fire", label: "Rapid Fire" },
                { value: "thinking-time", label: "Denkzeit" },
                { value: "buzzer", label: "Buzzer Modus" }
              ]}
            />

            <Select
              label="Schwierigkeit"
              value={gameState.difficulty}
              onChange={(value) => updateGameState({ difficulty: value })}
              data={[
                { value: "easy", label: "Leicht" },
                { value: "medium", label: "Mittel" },
                { value: "hard", label: "Schwer" }
              ]}
            />
          </Group>

          <Group grow>
            <NumberInput
              label="Denkzeit (Sekunden)"
              value={gameState.timeSettings?.thinkingTimeSeconds || 30}
              onChange={(value) =>
                updateGameState({
                  timeSettings: {
                    ...gameState.timeSettings,
                    thinkingTimeSeconds: Number(value) || 30
                  }
                })
              }
              min={5}
              max={120}
            />

            <NumberInput
              label="Antwortzeit (Sekunden)"
              value={gameState.timeSettings?.answerTimeSeconds || 5}
              onChange={(value) =>
                updateGameState({
                  timeSettings: {
                    ...gameState.timeSettings,
                    answerTimeSeconds: Number(value) || 5
                  }
                })
              }
              min={1}
              max={30}
            />
          </Group>

          <Switch
            label="Antwort automatisch anzeigen"
            description="Zeigt die Antwort automatisch nach Ablauf der Zeit"
            checked={gameState.autoShowAnswer || false}
            onChange={(event) =>
              updateGameState({ autoShowAnswer: event.currentTarget.checked })
            }
          />
        </Stack>
      </Card>

      {/* Kategorien */}
      <Card withBorder>
        <Text fw={600} mb="md">
          Kategorien
        </Text>
        <MultiSelect
          label="Verfügbare Kategorien"
          placeholder="Kategorien auswählen oder hinzufügen..."
          data={gameState.categories || []}
          value={gameState.categories || []}
          searchable
          onChange={(values) => updateGameState({ categories: values })}
        />
      </Card>

      <Divider />

      {/* Fragen */}
      <Card withBorder>
        <Group justify="space-between" mb="md">
          <Text fw={600}>Fragen ({gameState.questions?.length || 0})</Text>
          <Button
            leftSection={<IconPlus size={16} />}
            variant="light"
            onClick={addQuestion}
            size="sm"
          >
            Frage hinzufügen
          </Button>
        </Group>

        <Stack gap="md">
          {gameState.questions?.map((question, index) => (
            <Card key={question.id} withBorder p="md" bg="gray.0">
              <Group justify="space-between" mb="sm">
                <Badge size="sm" variant="light">
                  Frage {index + 1}
                </Badge>
                <ActionIcon
                  color="red"
                  variant="light"
                  onClick={() => removeQuestion(index)}
                  size="sm"
                >
                  <IconTrash size={14} />
                </ActionIcon>
              </Group>

              <Stack gap="sm">
                <TextInput
                  label="Frage"
                  placeholder="Gib hier die Frage ein..."
                  value={question.text}
                  onChange={(e) =>
                    updateQuestion(index, { text: e.target.value })
                  }
                />

                <TextInput
                  label="Antwort"
                  placeholder="Gib hier die Antwort ein..."
                  value={question.answer}
                  onChange={(e) =>
                    updateQuestion(index, { answer: e.target.value })
                  }
                />

                <NumberInput
                  label="Punkte"
                  value={question.points}
                  onChange={(value) =>
                    updateQuestion(index, { points: Number(value) || 1 })
                  }
                  min={1}
                  max={10}
                />
              </Stack>
            </Card>
          )) || []}
        </Stack>

        {(!gameState.questions || gameState.questions.length === 0) && (
          <Box ta="center" py="xl">
            <Text c="dimmed">Noch keine Fragen vorhanden</Text>
            <Text size="sm" c="dimmed" mt="xs">
              Klicke auf &quot;Frage hinzufügen&quot;, um zu beginnen
            </Text>
          </Box>
        )}
      </Card>

      {/* useGameshowConfig Hook Informationen */}
      <Card withBorder bg="green.0">
        <Text fw={600} mb="sm" c="green.8">
          ✅ Hook Funktionen verwendet:
        </Text>
        <Stack gap="xs">
          <Text size="sm" c="green.7">
            • <code>updateGame()</code> - Für State-Updates
          </Text>
          <Text size="sm" c="green.7">
            • <code>[gameName]</code> - Direkter Zugriff auf Game State
          </Text>
          <Text size="sm" c="green.7">
            • Automatische Persistierung im Gameshow-Context
          </Text>
          <Text size="sm" c="green.7">
            • Type-safe Updates durch TypeScript
          </Text>
        </Stack>
      </Card>
    </Stack>
  );
};

export default ExampleGameConfigurator;
