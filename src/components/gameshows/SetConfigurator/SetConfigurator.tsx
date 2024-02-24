import { useContext, useEffect, useState } from "react";
import { useImmer } from "use-immer";
import QuestionFormLayout from "~/components/layout/QuestionFormLayout";
import type { TSetQuestionItem, TSetQuestionList } from "~/components/room/Game/games/Set/set.types";
import { Games } from "~/components/room/Game/games/game.types";
import { useGameshowConfig } from "~/hooks/useGameshowConfig/useGameshowConfig";
import CreateSetContainer from "./components/CreateSetContainer";
import { generateNewSetQuestion } from "./helpers";
import { StepperControlsContext } from "~/context/StepperControlsContext";

export const NUM_OF_CARDS = 12;

const SetConfigurator = () => {
  const { disableContinueButton, enableContinueButton } = useContext(StepperControlsContext);
  const { updateGame, set } = useGameshowConfig(Games.SET);

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
    updateGame((draft) => {
      draft.questions = questions;
    });

    if (questions.length <= 0) {
      disableContinueButton();
    } else {
      enableContinueButton();
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
