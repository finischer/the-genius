import { type IGameGeneralState } from "../game.types";
import { SET_COLORS, type ISetGameState } from "./set.types";

export type TSetGameState = ISetGameState & IGameGeneralState;

export const DEFAULT_SET_STATE: TSetGameState = {
  identifier: "set",
  name: "Set",
  modes: ["DUELL", "TEAM"],
  maxPoints: 7,
  scorebarMode: "circle",
  rules: "",
  allCards: [],
  markedCards: [],
  qIndex: 0,
  display: {
    cards: false,
    markedCards: false,
  },

  getRules() {
    return `
    
    `;
  },
};

export const SET_COLORS_MAP = {
  red: SET_COLORS.RED,
  blue: SET_COLORS.BLUE,
  green: SET_COLORS.GREEN,
};
