import { type Updater } from "use-immer";
import { type TFlaggenGameState } from "~/pages/room/_components/Game/games/Flaggen/config";
import { type TMemoryGameState } from "~/pages/room/_components/Game/games/Memory/config";
import { type TMerkenGameState } from "~/pages/room/_components/Game/games/Merken/config";
import {
  type TGame,
  type TGameNames,
} from "~/pages/room/_components/Game/games/game.types";

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
