import {
  ActionIcon,
  Button,
  Divider,
  Flex,
  Group,
  NumberInput,
  Stack,
  Text,
  TextInput
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useContext, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import QuestionFormLayout from "~/components/layout/QuestionFormLayout";
import { StepperControlsContext } from "~/context/StepperControlsContext";
import { Game } from "~/games";
import {
  DEFAULT_FRAGENHAGEL_INTERVALS,
  FRAGENHAGEL_BAR_COUNT
} from "~/games/Fragenhagel/config";
import type {
  TFragenhagelInterval,
  TFragenhagelQuestion
} from "~/games/Fragenhagel/fragenhagel.types";
import { useGameshowConfig } from "~/hooks/useGameshowConfig/useGameshowConfig";
import useNotification from "~/hooks/useNotification";

type TFragenhagelFormValues = {
  id: string;
  question: string;
  answer: string;
};

type TIntervalFormValues = {
  label: string;
  start: number;
  end: number;
};

const FragenhagelConfigurator = () => {
  const { disableContinueButton, enableContinueButton } = useContext(
    StepperControlsContext
  );
  const { showErrorNotification } = useNotification();
  const { fragenhagel, updateGame } = useGameshowConfig(Game.FRAGENHAGEL);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [questions, setQuestions] = useState<TFragenhagelQuestion[]>(
    fragenhagel.questions
  );
  const [intervals, setIntervals] = useState<TFragenhagelInterval[]>(
    fragenhagel.configuredIntervals.length > 0
      ? fragenhagel.configuredIntervals
      : DEFAULT_FRAGENHAGEL_INTERVALS
  );

  // ── Question form ──────────────────────────────────────────────
  const form = useForm<TFragenhagelFormValues>({
    initialValues: { id: uuidv4(), question: "", answer: "" },
    validate: {
      question: (v) =>
        v.trim().length === 0 ? "Bitte gib eine Frage ein!" : null,
      answer: (v) =>
        v.trim().length === 0 ? "Bitte gib eine Antwort ein!" : null
    }
  });

  const handleSubmit = form.onSubmit(
    (values) => {
      const newQuestion: TFragenhagelQuestion = {
        id: values.id,
        question: values.question.trim(),
        answer: values.answer.trim()
      };
      const existingIds = questions.map((q) => q.id);
      if (existingIds.includes(newQuestion.id)) {
        setQuestions((prev) =>
          prev.map((q) => (q.id === newQuestion.id ? newQuestion : q))
        );
      } else {
        setQuestions((prev) => [...prev, newQuestion]);
      }
      form.reset();
      form.setFieldValue("id", uuidv4());
      inputRef.current?.focus();
    },
    (errors) => {
      Object.values(errors).forEach((error) => {
        showErrorNotification({ title: "Fehler", message: error });
      });
    }
  );

  const handleOnSelectQuestion = (question: TFragenhagelQuestion) => {
    form.setValues({
      id: question.id,
      question: question.question,
      answer: question.answer
    });
  };

  // ── Interval form ──────────────────────────────────────────────
  const intervalForm = useForm<TIntervalFormValues>({
    initialValues: { label: "", start: 20, end: 25 },
    validate: {
      label: (v) =>
        v.trim().length === 0 ? "Bitte gib eine Bezeichnung ein!" : null,
      start: (v, values) =>
        v >= values.end ? "Start muss kleiner als Ende sein!" : null,
      end: (v, values) =>
        v <= values.start ? "Ende muss größer als Start sein!" : null
    }
  });

  const handleAddInterval = intervalForm.onSubmit((values) => {
    const newInterval: TFragenhagelInterval = {
      id: uuidv4(),
      label: values.label.trim(),
      start: values.start,
      end: values.end
    };
    setIntervals((prev) => [...prev, newInterval]);
    intervalForm.reset();
    intervalForm.setValues({ label: "", start: 20, end: 25 });
  });

  const handleDeleteInterval = (id: string) => {
    setIntervals((prev) => prev.filter((i) => i.id !== id));
  };

  // ── Sync to game state ─────────────────────────────────────────
  useEffect(() => {
    if (questions.length > 0) {
      enableContinueButton();
    } else {
      disableContinueButton();
    }
    updateGame((draft) => {
      draft.questions = questions;
    });
  }, [questions]);

  useEffect(() => {
    updateGame((draft) => {
      draft.configuredIntervals = intervals;
    });
  }, [intervals]);

  return (
    <QuestionFormLayout
      questions={questions}
      setQuestions={setQuestions}
      onSelectQuestion={handleOnSelectQuestion}
      selectedQuestionId={form.values.id}
      onFormSubmit={handleSubmit}
      renderValueByKey="question"
    >
      <Stack gap="xl" w="100%">
        {/* Question fields */}
        <Flex direction="column" gap="md" w="100%">
          <TextInput
            ref={inputRef}
            required
            label="Frage"
            placeholder="Wie heißt die Hauptstadt von Frankreich?"
            {...form.getInputProps("question")}
          />
          <TextInput
            required
            label="Antwort"
            placeholder="Paris"
            {...form.getInputProps("answer")}
          />
        </Flex>

        <Divider label="Intervalle" labelPosition="left" />

        {/* Interval list */}
        <Stack gap="xs">
          {intervals.length === 0 && (
            <Text size="sm" c="dimmed">
              Noch keine Intervalle konfiguriert.
            </Text>
          )}
          {intervals.map((interval) => (
            <Group key={interval.id} justify="space-between" wrap="nowrap">
              <Text size="sm" fw={500}>
                {interval.label}
              </Text>
              <Group gap="xs" wrap="nowrap">
                <Text size="sm" c="dimmed">
                  {interval.start}s – {interval.end}s
                </Text>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  size="sm"
                  onClick={() => handleDeleteInterval(interval.id)}
                >
                  <IconTrash size={14} />
                </ActionIcon>
              </Group>
            </Group>
          ))}
        </Stack>

        {/* Add interval form */}
        <Stack gap="xs">
          <TextInput
            label="Bezeichnung"
            placeholder="z. B. Intervall 1"
            {...intervalForm.getInputProps("label")}
          />
          <Group grow>
            <NumberInput
              label="Start (Sek.)"
              min={1}
              max={FRAGENHAGEL_BAR_COUNT - 1}
              {...intervalForm.getInputProps("start")}
            />
            <NumberInput
              label="Ende (Sek.)"
              min={2}
              max={FRAGENHAGEL_BAR_COUNT}
              {...intervalForm.getInputProps("end")}
            />
          </Group>
          <Button
            leftSection={<IconPlus size={14} />}
            variant="light"
            onClick={() => void handleAddInterval()}
          >
            Intervall hinzufügen
          </Button>
        </Stack>
      </Stack>
    </QuestionFormLayout>
  );
};

export default FragenhagelConfigurator;
