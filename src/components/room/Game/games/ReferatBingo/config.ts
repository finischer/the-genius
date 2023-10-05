import { type IGameGeneralState } from "../game.types";
import type { IReferatBingoState, TReferatBingoNotefieldState } from "./referatBingo.types";

export type TReferatBingoGameState = IReferatBingoState & IGameGeneralState;

const NUM_BINGO_FIELDS = 9;

const DEFAULT_NOTEFIELD_STATE: TReferatBingoNotefieldState = {
  answers: new Array(NUM_BINGO_FIELDS).fill(""),
  selectedAnswers: [],
  submitted: false,
};

export const DEFAULT_REFERAT_BINGO_STATE: TReferatBingoGameState = {
  identifier: "referatBingo",
  name: "Referat Bingo",
  modes: ["TEAM"],
  maxPoints: 999,
  scorebarMode: "number",
  rules: "",
  topics: [],
  qIndex: 0,
  presenter: {
    id: "",
    name: "",
    isPresenting: false,
  },
  notefields: {
    teamOne: DEFAULT_NOTEFIELD_STATE,
    teamTwo: DEFAULT_NOTEFIELD_STATE,
  },
  display: {
    notefields: {
      teamOne: false,
      teamTwo: false,
    },
    topic: false,
  },
  getRules() {
    return `
        
    `;
  },
};
