import { type IGameGeneralState } from "../game.types";
import type {
  TDuSagstAnswerColors,
  IDuSagstState,
  TDuSagstPlayerState,
  TDuSagstTeamState,
  TDuSagstAnswerOptions,
  TDuSagstAnswerSelectMapValue,
} from "./duSagst.types";

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

export const ANSWER_BACKGROUND_COLORS: { [index in TDuSagstAnswerColors]: string } = {
  pink: "#C100FF",
  blue: "#0065FF",
  green: "#28B141",
  yellow: "#FF9900",
  transparent: "transparent",
};

export const ANSWER_SELECT_MAP: { [index: number]: TDuSagstAnswerSelectMapValue } = {
  0: {
    label: "A",
    color: "blue",
  },
  1: {
    label: "B",
    color: "green",
  },
  2: {
    label: "C",
    color: "pink",
  },
  3: {
    label: "D",
    color: "yellow",
  },
};

export const DEFAULT_DUSAGST_STATE: TDuSagstGameState = {
  identifier: "duSagst",
  name: "Du Sagst...",
  modes: ["TEAM"],
  maxPoints: 6,
  scorebarMode: "circle",
  qIndex: 0,
  questions: [],
  answers: ["", "", "", ""],
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
