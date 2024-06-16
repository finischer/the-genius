import { Button, Flex } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { v4 as uuidv4 } from "uuid";
import type { TGeheimwoerterQuestionItem } from "~/components/room/Game/games/Geheimwörter/geheimwörter.types";
import { Game } from "~/components/room/Game/games/game.types";
import { useGameshowConfig } from "~/hooks/useGameshowConfig/useGameshowConfig";
import { useScreen } from "~/hooks/useScreen";
import type { TQuestionFormMode } from "../types";
import CodeList from "./components/CodeList";
import type { TCodeList, TCodeListItem } from "./components/CodeList/codeList.types";
import CreateQuestionForm from "./components/CreateQuestionForm";
import QuestionList from "./components/QuestionList";
import { StepperControlsContext } from "~/context/StepperControlsContext";

const ALPHABET = [..."abcdefghijklmnoprstuvwxyz"];
const DEFAULT_CODE_WORD_LIST = [
  "Autoteil",
  "Beruf",
  "Computerspiel",
  "Dateiendung",
  "Ereignis",
  "Farbe",
  "Gemälde",
  "Haustier",
  "Instrument",
  "Jahreszeit",
  "Künstler",
  "Lied",
  "Milchprodukt",
  "Naturphänomen",
  "Obst",
  "Politiker",
  "Roman",
  "Stadt",
  "Transportmittel",
  "Unternehmen",
  "Verein",
  "Werkzeug",
  "Zahl",
];

const generateCodeList = (alphabetList: string[], codeWords: string[]) => {
  const codeList: TCodeList = [];

  for (const letter of alphabetList) {
    const codeWord = codeWords.find((word) => word[0]?.toUpperCase() === letter.toUpperCase());
    if (codeWord) {
      const codeListItem: TCodeListItem = {
        letter,
        category: codeWord,
      };

      codeList.push(codeListItem);
    }
  }

  return codeList;
};

const GeheimwörterConfigurator = () => {
  const { disableContinueButton, enableContinueButton } = useContext(StepperControlsContext);
  const { isMediumScreen } = useScreen();

  const { updateGame, geheimwoerter } = useGameshowConfig(Game.GEHEIMWOERTER);
  const [codeListEditable, setCodeListEditable] = useState(false);
  const [questionList, setQuestionList] = useState<TGeheimwoerterQuestionItem[]>(geheimwoerter.questions);
  const [questionItem, setQuestionItem] = useImmer<TGeheimwoerterQuestionItem>({
    id: uuidv4(),
    answer: "",
    words: [],
  });
  const questionFormMode: TQuestionFormMode = questionList.map((i) => i.id).includes(questionItem.id)
    ? "UPDATE"
    : "ADD";

  useEffect(() => {
    // set default code list
    if (geheimwoerter.codeList.length === 0) {
      updateGame((draft) => {
        draft.codeList = generateCodeList(ALPHABET, DEFAULT_CODE_WORD_LIST);
      });
    }
  }, []);

  const addQuestion = (newQuestion: TGeheimwoerterQuestionItem) => {
    setQuestionList((oldQuestions) => [...oldQuestions, newQuestion]);
  };

  const updateQuestion = (newQuestion: TGeheimwoerterQuestionItem) => {
    setQuestionList((oldQuestions) => {
      const index = oldQuestions.findIndex((q) => q.id === newQuestion.id);
      const newQuestions = [...oldQuestions];

      newQuestions[index] = newQuestion;

      return newQuestions;
    });
  };

  useEffect(() => {
    updateGame((draft) => {
      draft.questions = questionList;
    });
  }, [questionList]);

  useEffect(() => {
    const codes = geheimwoerter.codeList.map((item) => item.category);

    if (codes.some((item) => item.length === 1) || geheimwoerter.questions.length === 0) {
      disableContinueButton();
    } else {
      enableContinueButton();
    }
  }, [geheimwoerter.codeList, geheimwoerter.questions]);

  return (
    <Flex
      gap="md"
      direction={isMediumScreen ? "column" : "row"}
    >
      <Flex
        direction="column"
        gap="sm"
        w="100%"
        align="flex-start"
      >
        <CodeList
          codeList={geheimwoerter.codeList}
          setCodeList={updateGame}
          editable={codeListEditable}
        />
        <Button onClick={() => setCodeListEditable((oldState) => !oldState)}>
          {codeListEditable ? "Liste speichern" : "Liste bearbeiten"}
        </Button>
      </Flex>

      <CreateQuestionForm
        onAddQuestion={addQuestion}
        onUpdateQuestion={updateQuestion}
        codeList={geheimwoerter.codeList}
        question={questionItem}
        setQuestion={setQuestionItem}
        mode={questionFormMode}
      />

      <QuestionList
        questions={questionList}
        setQuestions={setQuestionList}
        setQuestionItem={setQuestionItem}
        questionItem={questionItem}
      />
    </Flex>
  );
};

export default GeheimwörterConfigurator;
