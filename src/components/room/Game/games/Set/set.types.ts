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

export type TSetCard = {
  form: "rectangle" | "oval" | "diamond";
  amount: 1 | 2 | 3;
  color: "red" | "green" | "blue";
  filling: "filled" | "none" | "dashed";
};

export interface ISetGameState {
  allCards: TSetCardList[];
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
