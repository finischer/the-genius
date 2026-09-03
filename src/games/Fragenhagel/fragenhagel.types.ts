import type { TFragenhagelGameState } from "./config";
import type { Game } from "../core/types";

export interface IFragenhagelGameProps {
  game: TFragenhagelGameState;
}

export type TFragenhagelInterval = {
  id: string;
  label: string;
  start: number;
  end: number;
};

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
  configuredIntervals: TFragenhagelInterval[];
  qIndex: number;
  currentScore: number;
  activePlayerId: string | null; // userId of the currently active player
  buzzerCount: number; // 0 = idle, 1 = timer running, 2 = locked until round ends
  timerState: TFragenhagelTimerState;
  intervalState: TFragenhagelIntervalState;
}
