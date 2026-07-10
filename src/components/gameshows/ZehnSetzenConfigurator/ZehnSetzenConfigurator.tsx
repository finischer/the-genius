import {
  Button,
  ButtonGroup,
  Flex,
  TextInput,
  useMantineTheme
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useContext, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import QuestionFormLayout from "~/components/layout/QuestionFormLayout";
import type { TZehnSetzenQuestion } from "~/games/ZehnSetzen/zehnSetzen.types";
import { StepperControlsContext } from "~/context/StepperControlsContext";
import { useGameshowConfig } from "~/hooks/useGameshowConfig/useGameshowConfig";
import useNotification from "~/hooks/useNotification";
import { Game } from "~/games";

const PLACEHOLDER_MAP: { [index: number]: string } = {
  0: "ca. 73 Mio.",
  1: "ca. 83 Mio.",
  2: "ca. 93 Mio.",
  3: "ca. 103 Mio."
};

const ZehnSetzenConfigurator = () => {
  const theme = useMantineTheme();
  const { disableContinueButton, enableContinueButton } = useContext(
    StepperControlsContext
  );
  const { showErrorNotification } = useNotification();
  const { zehnSetzen, updateGame } = useGameshowConfig(Game.ZEHN_SETZEN);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [questions, setQuestions] = useState<TZehnSetzenQuestion[]>(
    zehnSetzen.questions
  );

  const form = useForm<TZehnSetzenQuestion>({
    initialValues: {
      id: uuidv4(),
      question: "",
      answers: [
        { id: uuidv4(), answer: "" },
        { id: uuidv4(), answer: "" },
        { id: uuidv4(), answer: "" },
        { id: uuidv4(), answer: "" }
      ],
      // answers: Array<TZehnSetzenAnswer>(4).fill(DEFAULT_ANSWER),
      correctAnswer: null
    },
    validate: (values) => {
      const errors: Record<string, string> = {};

      if (!values.question) {
        errors.question = "Bitte gib eine Frage ein!";
      }

      const answers = values.answers.map((answer) => answer.answer);

      if (answers.includes("")) {
        errors.answers = "Bitte gib für alle Antworten einen Text ein!";
      }

      if (!values.correctAnswer) {
        errors.correctAnswer = "Bitte markiere die richtige Antwort!";
      }

      return errors;
    }
  });

  const handleSubmit = form.onSubmit(
    (newQuestion) => {
      console.log("Errors: ", form.errors);

      console.log("Submit question: ", newQuestion);
      const questionIds = questions.map((q) => q.id);

      if (questionIds.includes(newQuestion.id)) {
        // update existing question
        setQuestions((oldQuestions) =>
          oldQuestions.map((q) => {
            if (q.id === newQuestion.id) {
              return newQuestion;
            }

            return q;
          })
        );
      } else {
        setQuestions((oldQuestions) => [...oldQuestions, newQuestion]);
      }

      form.reset();
      form.setFieldValue("id", uuidv4());
      inputRef.current?.focus();
    },
    (validationErrors) => {
      Object.values(validationErrors).forEach((error) => {
        showErrorNotification({
          title: "Fehler",
          message: error
        });
      });
    }
  );

  const handleOnSelectQuestion = (question: TZehnSetzenQuestion) => {
    form.setValues(question);
  };

  const answerInputElements = form.getValues().answers.map((item, index) => {
    const isCorrectAnswer = item.id === form.values.correctAnswer?.id;

    let label = `Antwort ${index + 1}`;

    if (isCorrectAnswer) {
      label += " (Richtige Antwort)";
    } else {
      label += " (Falsche Antwort)";
    }

    return (
      <ButtonGroup key={form.key(`answers.${index}.id`)} orientation="vertical">
        <TextInput
          key={form.key(`answers.${index}.id`)}
          required
          label={label}
          placeholder={PLACEHOLDER_MAP[index]}
          styles={{
            input: {
              borderBottomRightRadius: 0,
              borderBottomLeftRadius: 0,
              borderColor: isCorrectAnswer
                ? theme.colors.green[5]
                : theme.colors.red[5]
            }
          }}
          {...form.getInputProps(`answers.${index}.answer`)}
        />
        <Button
          onClick={() => {
            form.setFieldValue("correctAnswer", item);
          }}
          disabled={isCorrectAnswer}
        >
          Antwort als richtig markieren
        </Button>
      </ButtonGroup>
    );
  });

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

  return (
    <QuestionFormLayout
      questions={questions}
      setQuestions={setQuestions}
      onSelectQuestion={handleOnSelectQuestion}
      selectedQuestionId={form.values.id}
      onFormSubmit={handleSubmit}
    >
      <Flex direction="column" gap="xl" w="100%">
        <TextInput
          ref={inputRef}
          required
          w="100%"
          label="Frage"
          placeholder="Wie viele Einwohner hat Deutschland?"
          {...form.getInputProps("question")}
        />
        {answerInputElements}
      </Flex>
    </QuestionFormLayout>
  );
};

export default ZehnSetzenConfigurator;
