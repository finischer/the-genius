import { IGameGeneralState } from "../game.types";
import { IMerkenState } from "./merken.types";

export type TDefaultMerkenState = IMerkenState & IGameGeneralState;

export const DEFAULT_MERKEN_STATE: TDefaultMerkenState = {
  identifier: "merken",
  name: "Merken",
  maxPoints: 7,
  scoreBarMode: "circle",
  allCardsFlipped: false,
  cards: [],
  openCards: [],
  timerState: {
    isActive: false,
    timeToThinkSeconds: 60,
  },
};
