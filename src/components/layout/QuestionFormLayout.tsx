import { Button, Container, Flex, ScrollArea, Title, type FlexProps, Box } from "@mantine/core";
import React, { useEffect, type SyntheticEvent } from "react";
import { useConfigurator } from "~/hooks/useConfigurator";
import List from "../shared/List";
import type { IListItem } from "../shared/List/components/ListItem/listItem.types";

interface IQuestionFormLayoutProps<T> extends FlexProps {
  setQuestions: React.Dispatch<React.SetStateAction<T[]>>;
  questions: T[];
  children: React.ReactNode;
  onSelectQuestion: (question: IListItem<T>) => void;
  selectedQuestionId: string;
  onFormSubmit: () => void;
  renderValueByKey?: keyof T;
  buttonText?: string;
  listTitle?: string;
  noQuestionsText?: string;
  itemName?: string;
}

const QuestionFormLayout = <T extends { id: string }>({
  children,
  questions,
  setQuestions,
  onSelectQuestion,
  onFormSubmit,
  selectedQuestionId,
  renderValueByKey,
  buttonText = "Frage",
  listTitle = "Fragen",
  noQuestionsText,
  itemName,
  ...props
}: IQuestionFormLayoutProps<T>) => {
  const [_, __, { enableFurtherButton, disableFurtherButton }] = useConfigurator("duSagst"); // TODO: Move button functions to an independent component
  const questionIds = questions.map((q) => q.id);
  const questionExists = questionIds.includes(selectedQuestionId);

  useEffect(() => {
    if (questions.length > 0) {
      enableFurtherButton();
    } else {
      disableFurtherButton();
    }
  }, [questions]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    onFormSubmit();
  };

  return (
    <Flex
      mah="100%"
      gap="xl"
      direction={{ base: "column", md: "row", lg: "row" }}
      align={{ base: "center", md: "unset", lg: "unset" }}
    >
      <Box w="100%">
        <form
          onSubmit={handleSubmit}
          style={{ width: "100%" }}
        >
          <Flex
            direction="column"
            gap="xl"
            align="center"
          >
            {children}
            <Button type="submit">
              {buttonText} {questionExists ? "speichern" : "hinzufügen"}
            </Button>
          </Flex>
        </form>
      </Box>

      <Flex
        w="100%"
        direction="column"
        gap="md"
        {...props}
      >
        <Title order={3}>{listTitle}</Title>
        <ScrollArea
          mih="100%"
          // h="calc(100vh - 30rem)"
        >
          <List
            data={questions}
            setData={setQuestions}
            onClickItem={onSelectQuestion}
            editable
            deletableItems
            selectedItemId={selectedQuestionId}
            renderValueByKey={renderValueByKey}
            emptyListText={noQuestionsText}
            itemName={itemName}
          />
        </ScrollArea>
      </Flex>
    </Flex>
  );
};

export default QuestionFormLayout;
