import type { TCodeList } from "~/components/gameshows/GeheimwörterConfigurator/components/CodeList/codeList.types";
import { type TGeheimwörterGameState } from "./config";

export type TGeheimWoerterQuestionsWordsItem = {
  word: string;
  category: string;
};

export type TGeheimwoerterQuestionItem = {
  words: TGeheimWoerterQuestionsWordsItem[];
  answer: string;
};

export interface IGeheimwörterState {
  answer: string;
  codeList: TCodeList;
  questions: TGeheimwoerterQuestionItem[];
  display: {
    answer: boolean;
    codeList: boolean;
    words: boolean;
  };
  qIndex: number;
}

export interface IGeheimwörterGameProps {
  game: TGeheimwörterGameState;
}
