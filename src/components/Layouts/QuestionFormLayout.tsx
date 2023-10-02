import { Button, Container, Flex, ScrollArea, Title } from "@mantine/core";
import React, { useState } from "react";
import List from "../shared/List";
import type { IListItem } from "../shared/List/components/ListItem/listItem.types";

interface IQuestionFormLayoutProps<T> {
  setQuestions: React.Dispatch<React.SetStateAction<T[]>>;
  questions: T[];
  children: React.ReactNode;
  onSelectQuestion: (question: IListItem<T>) => void;
  selectedQuestionId: string;
  onFormSubmit: () => void;
  renderValueByKey?: keyof T;
}

const QuestionFormLayout = <T extends { id: string }>({
  children,
  questions,
  setQuestions,
  onSelectQuestion,
  onFormSubmit,
  selectedQuestionId,
  renderValueByKey,
}: IQuestionFormLayoutProps<T>) => {
  const questionIds = questions.map((q) => q.id);
  const questionExists = questionIds.includes(selectedQuestionId);

  return (
    <Flex
      mah="100%"
      gap="xl"
    >
      <Container w="100%">
        <form
          onSubmit={onFormSubmit}
          style={{ width: "100%" }}
        >
          <Flex
            direction="column"
            gap="xl"
          >
            {children}
            <Button type="submit">Frage {questionExists ? "speichern" : "hinzufügen"}</Button>
          </Flex>
        </form>
      </Container>

      <Flex
        w="100%"
        direction="column"
      >
        <ScrollArea
          mih="100%"
          h="calc(100vh - 30rem)"
        >
          <List
            data={questions}
            setData={setQuestions}
            onClickItem={onSelectQuestion}
            editable
            selectedItemId={selectedQuestionId}
            renderValueByKey={renderValueByKey}
          />
        </ScrollArea>
      </Flex>
    </Flex>
  );
};

export default QuestionFormLayout;
