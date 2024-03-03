import type { TCodeList } from "~/components/gameshows/GeheimwörterConfigurator/components/CodeList/codeList.types";
import { type TGeheimwörterGameState } from "./config";
import type { IListItem } from "~/components/shared/List/components/ListItem/listItem.types";
import type { Game } from "../game.types";

export type TGeheimWoerterQuestionsWordsItem = {
  word: string;
  category: string;
};

export type TGeheimwoerterQuestionItem = IListItem<{
  id: string;
  words: TGeheimWoerterQuestionsWordsItem[];
  answer: string;
}>;

export interface IGeheimwörterState {
  identifier: Game.GEHEIMWOERTER;
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
