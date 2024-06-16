import type { TimerState } from "~/types/gameshow.types";
import type { Game } from "../game.types";
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

export type TDuSagstAnswerBoxState = {
  id: string;
  answerIndex: number;
  answerTheQuestion: boolean;
  submitted: boolean;
  showAnswer: boolean;
};

export type TDuSagstTeamState = {
  id: string;
  boxStates: TDuSagstAnswerBoxState[];
};

export type TDuSagstQuestion = IListItem<{ question: string; answers: TDuSagstAnswer[] }>;

export type TDuSagstAnswer = {
  id: string;
  text: string;
};

export interface IDuSagstState {
  identifier: Game.DUSAGST;
  questions: TDuSagstQuestion[];
  qIndex: number;
  timeToThinkSeconds: number;
  timer: TimerState;
  teamStates: {
    t1: TDuSagstTeamState;
    t2: TDuSagstTeamState;
  };
  display: {
    question: boolean;
    answers: number[]; // indices of answers
  };
}
