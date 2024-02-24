import type { Games } from "../game.types";
import { type TMerkenGameState } from "./config";

type TMerkenTimerState = {
  isActive: boolean;
  timeToThinkSeconds: number;
};

export interface IMerkenState {
  identifier: Games.MERKEN;
  timerState: TMerkenTimerState;
  cards: string[]; // path to icon on server side
  openCards: number[]; // array of index which card is open
  allCardsFlipped: boolean; // true if all cards are flipped
}

export interface IMerkenGameProps {
  game: TMerkenGameState;
}
