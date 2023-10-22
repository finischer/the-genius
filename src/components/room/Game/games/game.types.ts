import type { GameshowMode } from "@prisma/client";
import { type TGameSettingsMap } from "~/hooks/useConfigurator/useConfigurator.types";

export type TScorebarMode = "number" | "circle";

export enum Games {
  FLAGGEN = "flaggen",
  MEMORY = "memory",
  GEHEIMWOERTER = "geheimwoerter",
  SET = "set",
  DUSAGST = "duSagst",
  REFERATBINTO = "referatBingo",
}

export type TGameNames =
  | "flaggen"
  | "memory"
  | "merken"
  | "geheimwoerter"
  | "set"
  | "duSagst"
  | "referatBingo";

export interface IGameGeneralState {
  name: string;
  identifier: TGameNames;
  maxPoints: number;
  scorebarMode: TScorebarMode;
  rules: string; // just rules as string -> will generate when user clicks on 'save gameshow' button
  modes: GameshowMode[]; // for which modes was this game created
  getRules: () => string; // function to get the current rules while config the game. Some text in rules depends on other variables in same object
}

export type TGameMap = {
  [gameIdentifier in TGameNames]: React.ReactNode;
};

export type TGame = TGameSettingsMap[TGameNames];

// types for index.tsx (Game)
export interface IGameProps {
  game: TGame;
}
