import { Game, type IGameGeneralState } from "../game.types";
import type { IZehnSetzenGameState } from "./zehnSetzen.types";

export type TZehnSetzenGameState = IZehnSetzenGameState & IGameGeneralState;

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
      answerScores: []
    },
    t2: {
      id: "t2",
      answerScores: []
    }
  },
  display: {
    question: false,
    answers: []
  }
};
