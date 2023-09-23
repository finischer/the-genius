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

export interface ISetGameState {
  questions: TSetQuestionList;
  qIndex: number;
  display: {
    cards: boolean;
    markedCards: boolean;
  };
  markedCards: string[]; // id of cards
}

export type TSetQuestionList = TSetQuestionItem[];

export type TSetQuestionItem = {
  id: string;
  cards: TSetCard[];
};

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
