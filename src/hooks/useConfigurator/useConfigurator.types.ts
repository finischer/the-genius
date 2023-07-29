import { type Updater } from "use-immer";
import { type TFlaggenGameState } from "~/games/flaggen/config";
import { type TGame, type TGameNames } from "~/games/game.types";
import { type TMemoryGameState } from "~/games/memory/config";
import { type TMerkenGameState } from "~/games/merken/config";

export type TGameSettingsMap = {
  flaggen: TFlaggenGameState;
  memory: TMemoryGameState;
  merken: TMerkenGameState;
};

export type TGameshowConfig = {
  name: string;
  games: TGame[];
};

export interface IConfiguratorProvider {
  gameshowConfig: TGameshowConfig;
  updateGameshowConfig: Updater<TGameshowConfig>;
  selectedGames: TGameNames[];
  enableFurtherButton: () => void;
  disableFurtherButton: () => void;
  children: React.ReactNode;
}

export type TConfiguratorContext = [
  TGameSettingsMap,
  Updater<TGameSettingsMap>,
  {
    enableFurtherButton: () => void;
    disableFurtherButton: () => void;
  }
];
