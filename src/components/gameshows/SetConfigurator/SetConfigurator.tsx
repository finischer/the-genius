import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import QuestionFormLayout from "~/components/layout/QuestionFormLayout";
import type { TSetQuestionItem, TSetQuestionList } from "~/components/room/Game/games/Set/set.types";
import { useConfigurator } from "~/hooks/useConfigurator";
import CreateSetContainer from "./components/CreateSetContainer";
import { generateNewSetQuestion } from "./helpers";

export const NUM_OF_CARDS = 12;

const SetConfigurator = () => {
  const [set, setSet, { enableFurtherButton, disableFurtherButton }] = useConfigurator("set");

  const [questions, setQuestions] = useState<TSetQuestionList>(set.questions);
  const [questionItem, setQuestionItem] = useImmer<TSetQuestionItem>(
    questions.at(0) ?? generateNewSetQuestion(NUM_OF_CARDS)
  );

  const addQuestion = (newQuestion: TSetQuestionItem) => {
    const setIds = questions.map((q) => q.id);
    if (setIds.includes(newQuestion.id)) {
      updateQuestion(newQuestion);
    } else {
      setQuestions((oldQuestions) => [...oldQuestions, newQuestion]);
    }

    setQuestionItem(generateNewSetQuestion(NUM_OF_CARDS));
  };

  const updateQuestion = (updatedQuestion: TSetQuestionItem) => {
    setQuestions((oldQuestions) => {
      const index = oldQuestions.findIndex((q) => q.id === updatedQuestion.id);
      const newQuestions = [...oldQuestions];

      newQuestions[index] = updatedQuestion;

      return newQuestions;
    });
  };

  const handleSelectSet = (set: TSetQuestionItem) => {
    setQuestionItem(set);
  };

  useEffect(() => {
    setSet((draft) => {
      draft.set.questions = questions;
    });

    if (questions.length <= 0) {
      disableFurtherButton();
    } else {
      enableFurtherButton();
    }
  }, [questions]);

  return (
    <QuestionFormLayout
      questions={questions}
      selectedQuestionId={questionItem.id}
      setQuestions={setQuestions}
      onFormSubmit={() => addQuestion(questionItem)}
      onSelectQuestion={handleSelectSet}
      buttonText="Set"
      listTitle="Sets"
      noQuestionsText="Füge dein erstes Set hinzu!"
      itemName="Set"
      maw={400}
      w={300}
    >
      <CreateSetContainer
        question={questionItem}
        setQuestion={setQuestionItem}
      />
    </QuestionFormLayout>
  );
};

export default SetConfigurator;
