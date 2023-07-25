import { type Dispatch, type SetStateAction } from "react";
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
  updateGameshowConfig: Dispatch<SetStateAction<TGameshowConfig>>;
  selectedGames: TGameNames[];
  children: React.ReactNode;
}

export type TConfiguratorContext = [
  TGameSettingsMap,
  Updater<TGameSettingsMap>
];
