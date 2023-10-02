import type { TDuSagstGameState } from "./config";
import type { IListItem } from "~/components/shared/List/components/ListItem/listItem.types";

export interface IDuSagstGameProps {
  game: TDuSagstGameState;
}

export type TDuSagstAnswerOptions = "A" | "B" | "C" | "D" | "Keine Antwort";

export type TDuSagstAnswerColors = "green" | "blue" | "yellow" | "pink" | "transparent";

export type TDuSagstAnswerSelectMapValue = {
  label: TDuSagstAnswerOptions;
  color: TDuSagstAnswerColors;
};

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

export type TDuSagstQuestion = IListItem<{ question: string; answers: TDuSagstAnswer[] }>;

export type TDuSagstAnswer = {
  id: string;
  text: string;
};

export interface IDuSagstState {
  questions: TDuSagstQuestion[];
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
