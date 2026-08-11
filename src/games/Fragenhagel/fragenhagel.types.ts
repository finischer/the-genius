import type { TFragenhagelGameState } from "./config";
import type { Game } from "../core/types";

export interface IFragenhagelGameProps {
  game: TFragenhagelGameState;
}

export type TFragenhagelQuestion = {
  id: string;
  question: string;
  answer: string;
};

export type TFragenhagelIntervalState = {
  start: number;
  end: number;
};

export type TFragenhagelTimerState = {
  isActive: boolean;
  seconds: number;
};

export interface IFragenhagelState {
  identifier: Game.FRAGENHAGEL;
  questions: TFragenhagelQuestion[];
  qIndex: number;
  currentScore: number;
  timerState: TFragenhagelTimerState;
  intervalState: TFragenhagelIntervalState;
}
