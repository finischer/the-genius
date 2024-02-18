import { type Updater } from "use-immer";
import type { TDuSagstGameState } from "~/components/room/Game/games/DuSagst/config";
import type { TFlaggenGameState } from "~/components/room/Game/games/Flaggen/config";
import type { TGeheimwörterGameState } from "~/components/room/Game/games/Geheimwörter/config";
import type { TMerkenGameState } from "~/components/room/Game/games/Merken/config";
import type { TReferatBingoGameState } from "~/components/room/Game/games/ReferatBingo/config";
import type { TSetGameState } from "~/components/room/Game/games/Set/config";
import type { TGame, TGameNames } from "~/components/room/Game/games/game.types";

export type TGameSettingsMap = {
  flaggen: TFlaggenGameState;
  merken: TMerkenGameState;
  geheimwoerter: TGeheimwörterGameState;
  set: TSetGameState;
  duSagst: TDuSagstGameState;
  referatBingo: TReferatBingoGameState;
};

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
