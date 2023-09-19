export enum SET_COLORS {
  RED = "#F94900",
  GREEN = "#70A041",
  BLUE = "#1583ED",
}

export enum SET_FORMS {
  RECTANGLE = "rectangle",
  OVAL = "oval",
  DIAMONG = "diamond",
}

export enum SET_FILLING {
  FILLED = "filled",
  NONE = "none",
  DASHED = "dashed",
}

export type TSetCardList = TSetCard[];

export type TSetCardForm = "rectangle" | "oval" | "diamond";
export type TSetCardColor = "red" | "green" | "blue";
export type TSetCardFilling = "filled" | "none" | "dashed";
export type TSetCardAmount = 1 | 2 | 3;

export type TForm = {
  id: string;
  form: TSetCardForm;
  color: TSetCardColor;
  fill: TSetCardFilling;
};

export type TSetCard = {
  displayedForms: TForm[];
};

export interface ISetGameState {
  allCards: TSetCardList;
  qIndex: number;
  display: {
    cards: boolean;
    markedCards: boolean;
  };
  markedCards: TSetCard[];
}

export interface ISetGameProps {
  game: ISetGameState;
}

export type TCardFormList = {
  id: string;
  forms: TForm[];
};
