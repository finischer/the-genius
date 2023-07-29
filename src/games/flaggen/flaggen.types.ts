import { type TFlaggenGameState } from "./config";

export type TCountry = {
  country: string;
  shortCode: string;
};

export type TFlaggenDisplayState = {
  country: boolean;
  answer: boolean;
};

export interface IFlaggenState {
  countries: TCountry[];
  qIndex: number;
  display: TFlaggenDisplayState;
}

// types for index.tsx (FlaggenGame)
export interface IFlaggenGameProps {
  game: TFlaggenGameState;
}
