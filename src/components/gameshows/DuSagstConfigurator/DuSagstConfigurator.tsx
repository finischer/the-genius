import { Button, Container, Flex, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, {
  useRef,
  type SyntheticEvent,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import QuestionFormLayout from "~/components/Layouts/QuestionFormLayout";
import type { IListItem } from "~/components/shared/List/components/ListItem/listItem.types";
import { useConfigurator } from "~/hooks/useConfigurator";
import { v4 as uuidv4 } from "uuid";
import type { TDuSagstQuestion } from "~/components/room/Game/games/DuSagst/duSagst.types";
import { string } from "zod";

type TAnswer = {
  id: string;
  text: string;
};
type TQuestion = IListItem<{ question: string; answers: TAnswer[] }>;

type TFormValues = {
  id: string;
  question: string;
  answer_1: string;
  answer_2: string;
  answer_3: string;
  answer_4: string;
};

const DuSagstConfigurator = () => {
  const [duSagst, setDuSagst, { disableFurtherButton, enableFurtherButton }] = useConfigurator("duSagst");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [questions, setQuestions] = useState<TQuestion[]>([]);

  const form = useForm<TFormValues>({
    initialValues: {
      id: uuidv4(),
      question: "",
      answer_1: "",
      answer_2: "",
      answer_3: "",
      answer_4: "",
    },

    // transformValues: (values) => ({
    //   id: values.id,
    //   question: values.question,
    //   answers: Object.entries(values)
    //     .filter(([key, value]) => key.startsWith("answer_"))
    //     .map(([_, value]) => ({ id: uuidv4(), text: value })),
    // }),
  });

  const answerInputElements = Array(4)
    .fill(null)
    .map((_, index) => (
      <TextInput
        key={index}
        required
        label={`Antwort ${index + 1}`}
        placeholder="Cola"
        {...form.getInputProps(`answer_${index + 1}`)}
      />
    ));

  const buildQuestion = (formValues: TFormValues): TQuestion => {
    return {
      id: formValues.id,
      question: formValues.question,
      answers: Object.entries(formValues)
        .filter(([key, value]) => key.startsWith("answer_"))
        .map(([_, value]) => ({ id: uuidv4(), text: value })),
    };
  };

  const buildFormValues = (question: TQuestion): TFormValues => {
    const answerKeys = question.answers.map(
      (_, idx) => `answer_${idx + 1}`
    ) as unknown as (keyof TFormValues)[];

    const formValues: TFormValues = {
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

  const handleClickQuestion = (question: TQuestion) => {
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
      draft.duSagst.questions = questions as unknown as TDuSagstQuestion[];
    });
  }, [questions]);

  useEffect(() => {
    console.log(duSagst);
  }, [duSagst]);

  return (
    <QuestionFormLayout
      questions={questions}
      setQuestions={setQuestions}
      onSelectQuestion={handleClickQuestion}
      onFormSubmit={handleSubmit}
      selectedQuestionId={form.getInputProps("id").value}
    >
      <Flex
        direction="column"
        gap="xl"
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
