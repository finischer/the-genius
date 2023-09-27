import { Button, Container, Flex, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useRef, type SyntheticEvent, useEffect, useState } from "react";
import QuestionFormLayout from "~/components/Layouts/QuestionFormLayout";
import type { IListItem } from "~/components/shared/List/components/ListItem/listItem.types";
import { useConfigurator } from "~/hooks/useConfigurator";
import { v4 as uuidv4 } from "uuid";
import type { TDuSagstQuestion } from "~/components/room/Game/games/DuSagst/duSagst.types";

const DuSagstConfigurator = () => {
  const [duSagst, setDuSagst, { disableFurtherButton, enableFurtherButton }] = useConfigurator("duSagst");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [questions, setQuestions] = useState<IListItem[]>([]);
  const form = useForm({
    initialValues: {
      id: uuidv4(),
      question: "",
      answers: ["", "", "", ""],
    },
  });

  const answerInputElements = Array(4)
    .fill(null)
    .map((_, index) => (
      <TextInput
        key={index}
        required
        label={`Antwort ${index + 1}`}
        placeholder="Cola"
        {...form.getInputProps(`answers.${index}`)}
      />
    ));

  const handleSubmit = form.onSubmit((newQuestion) => {
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

  const handleClickQuestion = (question: IListItem) => {
    form.setValues(question);
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
