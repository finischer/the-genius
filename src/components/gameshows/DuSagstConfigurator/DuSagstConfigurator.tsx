import { Flex, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import QuestionFormLayout from "~/components/layout/QuestionFormLayout";
import type { TDuSagstQuestion } from "~/components/room/Game/games/DuSagst/duSagst.types";
import { useConfigurator } from "~/hooks/useGameConfigurator";
import type { TDuSagstFormValues } from "./duSagstConfigurator.types";

const PLACEHOLDER_MAP: { [index: number]: string } = {
  0: "Cola",
  1: "Wasser",
  2: "Apfelschorle",
  3: "Eistee",
};

const DuSagstConfigurator = () => {
  const [duSagst, setDuSagst, { disableFurtherButton, enableFurtherButton }] = useConfigurator("duSagst");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [questions, setQuestions] = useState<TDuSagstQuestion[]>(duSagst.questions);

  const form = useForm<TDuSagstFormValues>({
    initialValues: {
      id: uuidv4(),
      question: "",
      answer_1: "",
      answer_2: "",
      answer_3: "",
      answer_4: "",
    },
  });

  const answerInputElements = Array(4)
    .fill(null)
    .map((_, index) => (
      <TextInput
        key={index}
        required
        label={`Antwort ${index + 1}`}
        placeholder={PLACEHOLDER_MAP[index]}
        {...form.getInputProps(`answer_${index + 1}`)}
      />
    ));

  const buildQuestion = (formValues: TDuSagstFormValues): TDuSagstQuestion => {
    return {
      id: formValues.id,
      question: formValues.question,
      answers: Object.entries(formValues)
        .filter(([key, value]) => key.startsWith("answer_"))
        .map(([_, value]) => ({ id: uuidv4(), text: value })),
    };
  };

  const buildFormValues = (question: TDuSagstQuestion): TDuSagstFormValues => {
    const answerKeys = question.answers.map(
      (_, idx) => `answer_${idx + 1}`
    ) as unknown as (keyof TDuSagstFormValues)[];

    const formValues: TDuSagstFormValues = {
      id: question.id,
      question: question.question,
      answer_1: "",
      answer_2: "",
      answer_3: "",
      answer_4: "",
    };

    answerKeys.forEach((key, index) => {
      if (question.answers[index]) {
        formValues[key] = question.answers[index]?.text ?? "";
      }
    });

    return formValues;
  };

  const handleSubmit = form.onSubmit((newQuestion) => {
    const finalQuestion = buildQuestion(newQuestion);

    const questionIds = questions.map((q) => q.id);

    if (questionIds.includes(finalQuestion.id)) {
      // update existing question
      setQuestions((oldQuestions) =>
        oldQuestions.map((q) => {
          if (q.id === finalQuestion.id) {
            return finalQuestion;
          }

          return q;
        })
      );
    } else {
      setQuestions((oldQuestions) => [...oldQuestions, finalQuestion]);
    }

    form.reset();
    form.setFieldValue("id", uuidv4());
    inputRef.current?.focus();
  });

  const handleClickQuestion = (question: TDuSagstQuestion) => {
    const formValues = buildFormValues(question);
    form.setValues(formValues);
  };

  useEffect(() => {
    if (questions.length > 0) {
      enableFurtherButton();
    } else {
      disableFurtherButton();
    }

    setDuSagst((draft) => {
      draft.questions = questions as unknown as TDuSagstQuestion[];
    });
  }, [questions]);

  return (
    <QuestionFormLayout
      questions={questions}
      setQuestions={setQuestions}
      onSelectQuestion={handleClickQuestion}
      onFormSubmit={handleSubmit}
      selectedQuestionId={form.getInputProps("id").value as string}
      renderValueByKey="question"
    >
      <Flex
        direction="column"
        gap="xl"
        w="100%"
      >
        <TextInput
          ref={inputRef}
          required
          w="100%"
          label="Frage"
          placeholder="Welches ist mein Lieblingsgetränk?"
          {...form.getInputProps("question")}
        />
        {answerInputElements}
      </Flex>
    </QuestionFormLayout>
  );
};

export default DuSagstConfigurator;
