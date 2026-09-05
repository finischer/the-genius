import type { GameshowMode } from "~/generated/prisma/client";
import type { TFlaggenGameState } from "../Flaggen/config";
import type { TMerkenGameState } from "../Merken/config";
import type { TGeheimwörterGameState } from "../Geheimwörter/config";
import type { TSetGameState } from "../Set/config";
import type { TDuSagstGameState } from "../DuSagst/config";
import type { TReferatBingoGameState } from "../ReferatBingo/config";
import type { TZehnSetzenGameState } from "../ZehnSetzen/config";
import type { TFragenhagelGameState } from "../Fragenhagel/config";

export type TScorebarMode = "number" | "circle";

export enum Game {
  FLAGGEN = "flaggen",
  GEHEIMWOERTER = "geheimwoerter",
  MERKEN = "merken",
  SET = "set",
  DUSAGST = "duSagst",
  REFERATBINGO = "referatBingo",
  ZEHN_SETZEN = "zehnSetzen",
  FRAGENHAGEL = "fragenhagel"
}

export interface IGameGeneralState {
  identifier: Game;
  name: string;
  maxPoints: number;
  scorebarMode: TScorebarMode;
  rules: string; // just rules as string -> will generate when user clicks on 'save gameshow' button
  modes: GameshowMode[]; // for which modes was this game created
}

// Game Component Props
export interface IGameProps {
  gameName: Game;
}

// Erweiterte Game-spezifische States werden hier definiert
export interface TGameSettingsMap {
  // Diese werden von den einzelnen Games erweitert
  [Game.FLAGGEN]: TFlaggenGameState;
  [Game.MERKEN]: TMerkenGameState;
  [Game.GEHEIMWOERTER]: TGeheimwörterGameState;
  [Game.SET]: TSetGameState;
  [Game.DUSAGST]: TDuSagstGameState;
  [Game.REFERATBINGO]: TReferatBingoGameState;
  [Game.ZEHN_SETZEN]: TZehnSetzenGameState;
  [Game.FRAGENHAGEL]: TFragenhagelGameState;
}

export type GameState = TGameSettingsMap[Game];

export type TGameMap = {
  [gameIdentifier in Game]: React.ReactNode;
};
