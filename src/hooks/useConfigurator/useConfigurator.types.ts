import { type Updater } from "use-immer";
import { type TDefaultFlaggenState } from "~/games/flaggen/config";
import { type TGameNames } from "~/games/game.types";
import { type TDefaultMemoryState } from "~/games/memory/config";
import { type TDefaultMerkenState } from "~/games/merken/config";

export type TGameSettingsMap = {
  flaggen: TDefaultFlaggenState;
  memory: TDefaultMemoryState;
  merken: TDefaultMerkenState;
};

export type TGameshowConfig = {
  name: string;
  games: TGameSettingsMap[TGameNames][];
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
