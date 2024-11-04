import { Game, type IGameGeneralState } from "../game.types";
import type { IZehnSetzenGameState } from "./zehnSetzen.types";

export type TZehnSetzenGameState = IZehnSetzenGameState & IGameGeneralState;

export const MAX_SCORE = 10;

export const DEFAULT_ZEHN_SETZEN_STATE: TZehnSetzenGameState = {
  identifier: Game.ZEHN_SETZEN,
  name: "Zehn Setzen",
  modes: ["DUELL", "TEAM"],
  maxPoints: 10,
  scorebarMode: "number",
  rules: "",
  questions: [],
  qIndex: 0,
  teamStates: {
    t1: {
      id: "t1",
      answerScores: [0, 0, 0, 0],
      submitted: false
    },
    t2: {
      id: "t2",
      answerScores: [0, 0, 0, 0],
      submitted: false
    }
  },
  display: {
    question: false,
    answers: [],
    correctAnswer: false,
    teamScores: {
      t1: false,
      t2: false
    }
  }
};
