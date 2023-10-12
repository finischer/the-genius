import { Button, Flex } from "@mantine/core";
import { useEffect, useState } from "react";
import type { TGeheimwoerterQuestionItem } from "~/components/room/Game/games/Geheimwörter/geheimwörter.types";
import { useConfigurator } from "~/hooks/useConfigurator";
import CodeList from "./components/CodeList";
import type { TCodeList, TCodeListItem } from "./components/CodeList/codeList.types";
import CreateQuestionForm from "./components/CreateQuestionForm";
import QuestionList from "./components/QuestionList";
import { useImmer } from "use-immer";
import { v4 as uuidv4 } from "uuid";
import type { TQuestionFormMode } from "../types";
import type { constants } from "buffer";

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
  const [geheimwoerter, setGeheimwoerter, { enableFurtherButton, disableFurtherButton }] =
    useConfigurator("geheimwoerter");
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
      setGeheimwoerter((draft) => {
        draft.geheimwoerter.codeList = generateCodeList(ALPHABET, DEFAULT_CODE_WORD_LIST);
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
    setGeheimwoerter((draft) => {
      draft.geheimwoerter.questions = questionList;
    });
  }, [questionList]);

  useEffect(() => {
    const codes = geheimwoerter.codeList.map((item) => item.category);

    if (codes.some((item) => item.length === 1) || geheimwoerter.questions.length === 0) {
      disableFurtherButton();
    } else {
      enableFurtherButton();
    }
  }, [geheimwoerter.codeList, geheimwoerter.questions]);

  return (
    <Flex gap="md">
      <Flex
        direction="column"
        gap="sm"
        w="100%"
      >
        <CodeList
          codeList={geheimwoerter.codeList}
          setCodeList={setGeheimwoerter}
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
