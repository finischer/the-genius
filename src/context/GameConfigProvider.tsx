import type { Game as PrismaGame } from "~/generated/prisma/client";
import { useSearchParams } from "next/navigation";
import { createContext, useEffect, type FC, type ReactNode } from "react";
import { useImmer, type Updater } from "use-immer";
import type { GameState } from "~/games";
import type { TGameshowConfig } from "~/hooks/useGameshowConfig/useGameshowConfig.types";
import useNotification from "~/hooks/useNotification";
import { api } from "~/utils/api";

interface IGameConfigProviderProps {
  children: ReactNode;
}

export interface IGameConfigContextProps {
  gameshow: TGameshowConfig;
  setGameshow: Updater<TGameshowConfig>;
  availableGames: PrismaGame[];
  setAvailableGames: Updater<PrismaGame[]>;
}

const GameConfigContext = createContext<IGameConfigContextProps | undefined>(
  undefined
);

const DEFAULT_GAMESHOW_CONFIG = {
  name: "",
  games: []
};

const GameConfigProvider: FC<IGameConfigProviderProps> = ({ children }) => {
  const searchParams = useSearchParams();
  const { handleZodError } = useNotification();

  const gameshowId = searchParams.get("gameshowId");

  const [availableGames, setAvailableGames] = useImmer<PrismaGame[]>([]);
  const [gameshow, setGameshow] = useImmer<TGameshowConfig>(
    DEFAULT_GAMESHOW_CONFIG
  );

  // api
  const { data: gamesData, error: gamesError } = api.games.getAll.useQuery(
    undefined,
    { enabled: true }
  );

  const { data: gameshowData, error: gameshowError } =
    api.gameshows.getById.useQuery(
      { gameshowId: gameshowId ?? "" },
      { enabled: !!gameshowId }
    );

  useEffect(() => {
    if (gamesError)
      handleZodError(gamesError.data?.zodError, gamesError.message);
  }, [gamesError]);

  useEffect(() => {
    if (gamesData) setAvailableGames(gamesData);
  }, [gamesData]);

  useEffect(() => {
    if (gameshowError)
      handleZodError(gameshowError.data?.zodError, gameshowError.message);
  }, [gameshowError]);

  useEffect(() => {
    if (gameshowData) {
      const gameshowConfig: TGameshowConfig = {
        name: gameshowData.name,
        games: gameshowData.games as GameState[]
      };
      setGameshow(gameshowConfig);
    }
  }, [gameshowData]);

  return (
    <GameConfigContext.Provider
      value={{ gameshow, setGameshow, availableGames, setAvailableGames }}
    >
      {children}
    </GameConfigContext.Provider>
  );
};

export { GameConfigContext, GameConfigProvider };
