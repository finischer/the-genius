import type { Game } from "../game.types";
import type { TZehnSetzenGameState } from "./config";

export interface IZehnSetzenGameProps {
  game: TZehnSetzenGameState;
}

export type TZehnSetzenTeamState = {
  id: string;
  answerScores: number[];
};

export interface IZehnSetzenGameState {
  identifier: Game.ZEHN_SETZEN;
  questions: TZehnSetzenQuestion[];
  qIndex: number;
  teamStates: {
    t1: TZehnSetzenTeamState;
    t2: TZehnSetzenTeamState;
  };
  display: {
    question: boolean;
    answers: number[];
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
