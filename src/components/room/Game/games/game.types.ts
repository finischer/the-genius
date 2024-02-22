import type { GameshowMode } from "@prisma/client";
import type { TFlaggenGameState } from "./Flaggen/config";
import type { TMerkenGameState } from "./Merken/config";
import type { TGeheimwörterGameState } from "./Geheimwörter/config";
import type { TSetGameState } from "./Set/config";
import type { TDuSagstGameState } from "./DuSagst/config";
import type { TReferatBingoGameState } from "./ReferatBingo/config";

export type TScorebarMode = "number" | "circle";

export enum Games {
  FLAGGEN = "flaggen",
  GEHEIMWOERTER = "geheimwoerter",
  MERKEN = "merken",
  SET = "set",
  DUSAGST = "duSagst",
  REFERATBINTO = "referatBingo",
}

export type TGameSettingsMap = {
  flaggen: TFlaggenGameState;
  merken: TMerkenGameState;
  geheimwoerter: TGeheimwörterGameState;
  set: TSetGameState;
  duSagst: TDuSagstGameState;
  referatBingo: TReferatBingoGameState;
};

export type TGameNames = "flaggen" | "merken" | "geheimwoerter" | "set" | "duSagst" | "referatBingo";

export interface IGameGeneralState {
  name: string;
  maxPoints: number;
  scorebarMode: TScorebarMode;
  rules: string; // just rules as string -> will generate when user clicks on 'save gameshow' button
  modes: GameshowMode[]; // for which modes was this game created
}

export type TGameMap = {
  [gameIdentifier in TGameNames]: React.ReactNode;
};

export type TGame = TGameSettingsMap[TGameNames];

// types for index.tsx (Game)
export interface IGameProps {
  game: TGame;
}
