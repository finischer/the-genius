import { type Updater } from "use-immer";
import type { TGame, TGameNames, TGameSettingsMap } from "~/components/room/Game/games/game.types";

export type TGameshowConfig = {
  name: string;
  games: TGame[];
};

export interface IConfiguratorProvider {
  gameshow: TGameshowConfig;
  updateGameshow: Updater<TGameshowConfig>;
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
    updateGameshowMetadata: Updater<TGameshowConfig>;
  }
];

export type TGameConfigUpdateFn<T extends TGameNames> = (
  updateFn: (draft: TGameSettingsMap[T]) => void
) => void;
