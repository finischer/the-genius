import { Flex, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useContext, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import QuestionFormLayout from "~/components/layout/QuestionFormLayout";
import { StepperControlsContext } from "~/context/StepperControlsContext";
import { Game } from "~/games";
import type { TFragenhagelQuestion } from "~/games/Fragenhagel/fragenhagel.types";
import { useGameshowConfig } from "~/hooks/useGameshowConfig/useGameshowConfig";
import useNotification from "~/hooks/useNotification";

type TFragenhagelFormValues = {
  id: string;
  question: string;
  answer: string;
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

  const form = useForm<TFragenhagelFormValues>({
    initialValues: {
      id: uuidv4(),
      question: "",
      answer: ""
    },
    validate: {
      question: (value) =>
        value.trim().length === 0 ? "Bitte gib eine Frage ein!" : null,
      answer: (value) =>
        value.trim().length === 0 ? "Bitte gib eine Antwort ein!" : null
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
    (validationErrors) => {
      Object.values(validationErrors).forEach((error) => {
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
      renderValueByKey="question"
    >
      <Flex direction="column" gap="xl" w="100%">
        <TextInput
          ref={inputRef}
          required
          w="100%"
          label="Frage"
          placeholder="Wie heißt die Hauptstadt von Frankreich?"
          {...form.getInputProps("question")}
        />
        <TextInput
          required
          w="100%"
          label="Antwort"
          placeholder="Paris"
          {...form.getInputProps("answer")}
        />
      </Flex>
    </QuestionFormLayout>
  );
};

export default FragenhagelConfigurator;
