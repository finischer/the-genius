import { type IGameGeneralState } from "../game.types";
import type { IDuSagstState, TDuSagstAnswerBoxState, TDuSagstTeamState } from "./duSagst.types";
import { v4 as uuidv4 } from "uuid";

export type TDuSagstGameState = IDuSagstState & IGameGeneralState;

const createDefaultBoxState = (): TDuSagstAnswerBoxState => ({
  id: uuidv4(),
  answerIndex: -1,
  answerTheQuestion: false,
  showAnswer: false,
  submitted: true,
});

const createDefaultTeamState = (): TDuSagstTeamState => ({
  id: uuidv4(),
  boxStates: Array(2)
    .fill(null)
    .map((_) => createDefaultBoxState()),
});

export const DUSAGST_TIME_TO_THINK_SECONDS = 30;

export const DEFAULT_DUSAGST_STATE: TDuSagstGameState = {
  identifier: "duSagst",
  name: "Du Sagst...",
  modes: ["TEAM"],
  maxPoints: 6,
  scorebarMode: "circle",
  qIndex: 0,
  questions: [],
  timeToThinkSeconds: DUSAGST_TIME_TO_THINK_SECONDS,
  teamStates: {
    t1: createDefaultTeamState(),
    t2: createDefaultTeamState(),
  },
  display: {
    answers: [],
    question: false,
  },
  rules: "",
  getRules() {
    return `
        
    `;
  },
};
