import type { Game as PrismaGame } from "@prisma/client";
import type { Game, TGame, TGameSettingsMap } from "~/components/room/Game/games/game.types";

export type TGameshowConfig = {
  name: string;
  games: TGame[];
};

export type TGameshowConfigKeys = Omit<TGameshowConfig, "games">;

export type GameConfigReturn<T extends Game, V> = V extends undefined
  ? Record<string, never>
  : {
      [key in T]: TGameSettingsMap[T];
    };

export type IUseGameshowConfigReturn<T extends Game, V> = GameConfigReturn<T, V> & {
  gameshow: TGameshowConfig;
  updateGameshowMetadata: (updateFn: (config: TGameshowConfigKeys) => void) => void;
  updateGameList: (newGameList: PrismaGame[]) => void;
  availableGames: PrismaGame[];

  updateGame: T extends undefined ? undefined : (updateFn: (config: TGameSettingsMap[T]) => void) => void;
};

export type TGameConfigUpdateFn<T extends Game> = (updateFn: (draft: TGameSettingsMap[T]) => void) => void;
