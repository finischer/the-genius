import type { TeamShortNames } from "~/types/gameshow.types";
import type { Game } from "../game.types";
import type { TZehnSetzenGameState } from "./config";

export interface IZehnSetzenGameProps {
  game: TZehnSetzenGameState;
}

export type TZehnSetzenTeamState = {
  id: string;
  answerScores: number[];
  submitted: boolean;
};

export interface IZehnSetzenGameState {
  identifier: Game.ZEHN_SETZEN;
  questions: TZehnSetzenQuestion[];
  qIndex: number;
  teamStates: { [K in TeamShortNames]: TZehnSetzenTeamState };
  display: {
    question: boolean;
    answers: number[];
    correctAnswer: boolean;
    teamScores: { [K in TeamShortNames]: boolean };
  };
}

export type TZehnSetzenAnswer = {
  id: string;
  answer: string;
};

export type TZehnSetzenQuestion = {
  id: string;
  question: string;
  answers: Array<TZehnSetzenAnswer>;
  correctAnswer: TZehnSetzenAnswer | null;
};
