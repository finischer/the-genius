import type { Game } from "@prisma/client";
import { type Updater } from "use-immer";
import type { Games, TGame, TGameNames, TGameSettingsMap } from "~/components/room/Game/games/game.types";

export type TGameshowConfig = {
  name: string;
  games: TGame[];
};

export type TGameshowConfigKeys = Omit<TGameshowConfig, "games">;

export type GameConfigReturn<T extends Games, V> = V extends undefined
  ? {}
  : {
      [key in T]: TGameSettingsMap[T];
    };

export type IUseGameshowConfigReturn<T extends Games, V> = GameConfigReturn<T, V> & {
  gameshow: TGameshowConfig;
  updateGameshowMetadata: (updateFn: (config: TGameshowConfigKeys) => void) => void;
  updateGameList: (newGameList: Game[]) => void;
  availableGames: Game[];

  updateGame: T extends undefined ? undefined : (updateFn: (config: TGameSettingsMap[T]) => void) => void;
};

export type TGameConfigUpdateFn<T extends TGameNames> = (
  updateFn: (draft: TGameSettingsMap[T]) => void
) => void;
