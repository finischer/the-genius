import type { IListItem } from "~/components/shared/List/components/ListItem/listItem.types";

export enum SET_COLORS {
  RED = "#F94900",
  GREEN = "#70A041",
  BLUE = "#1583ED",
}

export enum SET_FORMS {
  RECTANGLE = "rectangle",
  OVAL = "oval",
  DIAMOND = "diamond",
}

export enum SET_FILLING {
  FILLED = "filled",
  NONE = "none",
  DASHED = "dashed",
}

export interface ISetGameProps {
  game: ISetGameState;
}

export type TSetGameMarkedCardsState = "wrong" | "correct" | "marked";

export interface ISetGameState {
  questions: TSetQuestionList;
  qIndex: number;
  display: {
    cards: boolean;
    markedCards: boolean;
  };
  openedCards: number[]; // index of cards
  markedCards: number[]; // index of cards
  markedCardsState: TSetGameMarkedCardsState;
}

export type TSetQuestionList = TSetQuestionItem[];

export type TSetQuestionItem = IListItem<{
  id: string;
  cards: TSetCard[];
}>;

export type TSetCard = {
  id: string;
  form: TSetCardForm;
  color: TSetCardColor;
  fill: TSetCardFilling;
  amount: number;
};

export type TSetCardForm = "rectangle" | "oval" | "diamond";
export type TSetCardColor = "red" | "green" | "blue";
export type TSetCardFilling = "filled" | "none" | "dashed";
export type TSetCardAmount = 1 | 2 | 3;
