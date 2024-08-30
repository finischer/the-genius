import { Flex, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useContext, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import QuestionFormLayout from "~/components/layout/QuestionFormLayout";
import { Game } from "~/components/room/Game/games/game.types";
import type { TZehnSetzenQuestion } from "~/components/room/Game/games/ZehnSetzen/zehnSetzen.types";
import { StepperControlsContext } from "~/context/StepperControlsContext";
import { useGameshowConfig } from "~/hooks/useGameshowConfig/useGameshowConfig";

const PLACEHOLDER_MAP: { [index: number]: string } = {
  0: "ca. 73 Mio.",
  1: "ca. 83 Mio.",
  2: "ca. 93 Mio.",
  3: "ca. 103 Mio."
};

const ZehnSetzenConfigurator = () => {
  const { disableContinueButton, enableContinueButton } = useContext(
    StepperControlsContext
  );
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
    }
  });

  const handleSubmit = form.onSubmit((newQuestion) => {
    const correctAnswer = newQuestion.answers.at(0);
    if (correctAnswer) {
      newQuestion.correctAnswer = correctAnswer;
    }

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
  });

  const handleOnSelectQuestion = (question: TZehnSetzenQuestion) => {
    form.setValues(question);
  };

  const answerInputElements = form.getValues().answers.map((item, index) => {
    const isCorrectAnswer = index === 0;

    let label = `Antwort ${index + 1}`;

    if (isCorrectAnswer) {
      label += " (Richtige Antwort)";
    } else {
      label += " (Falsche Antwort)";
    }

    return (
      <TextInput
        key={form.key(`answers.${index}.id`)}
        required
        label={label}
        placeholder={PLACEHOLDER_MAP[index]}
        {...form.getInputProps(`answers.${index}.answer`)}
      />
    );
  });

  useEffect(() => {
    if (questions.length > 0) {
      enableContinueButton();
    } else {
      disableContinueButton();
    }

    updateGame((draft) => {
      draft.questions = questions as unknown as TZehnSetzenQuestion[];
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
