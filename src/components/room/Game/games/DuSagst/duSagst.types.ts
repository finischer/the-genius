import type { TDuSagstGameState } from "./config";

export interface IDuSagstGameProps {
  game: TDuSagstGameState;
}

export type TDuSagstPlayerState = {
  answerIndex: number;
  answerTheQuestion: boolean;
  submitted: boolean;
  showAnswer: boolean;
};

export type TDuSagstTeamState = {
  p1: TDuSagstPlayerState;
  p2: TDuSagstPlayerState;
};

export interface IDuSagstState {
  questions: string[];
  qIndex: number;
  answers: [string, string, string, string];
  teamStates: {
    t1: TDuSagstTeamState;
    t2: TDuSagstTeamState;
  };
  display: {
    question: boolean;
    answers: number[]; // indices of answers
  };
}
