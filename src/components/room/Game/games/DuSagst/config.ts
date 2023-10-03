import { type IGameGeneralState } from "../game.types";
import type { IDuSagstState, TDuSagstPlayerState, TDuSagstTeamState } from "./duSagst.types";

export type TDuSagstGameState = IDuSagstState & IGameGeneralState;

const DEFAULT_PLAYER_STATE: TDuSagstPlayerState = {
  answerIndex: -1,
  answerTheQuestion: false,
  showAnswer: false,
  submitted: false,
};

const DEFAULT_TEAM_STATE: TDuSagstTeamState = {
  p1: DEFAULT_PLAYER_STATE,
  p2: DEFAULT_PLAYER_STATE,
};

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
    t1: DEFAULT_TEAM_STATE,
    t2: DEFAULT_TEAM_STATE,
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
