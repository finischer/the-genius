import { type TMemoryGameState } from "./config";

export interface IMemoryState {
  cards: [];
}

export interface IMemoryGameProps {
  game: TMemoryGameState;
}
