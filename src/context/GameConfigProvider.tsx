import type { Game as PrismaGame } from "~/generated/prisma/client";
import { useSearchParams } from "next/navigation";
import { createContext, type FC, type ReactNode } from "react";
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
  // const action: TApiActions = (searchParams.get("action") as TApiActions) ?? "create";

  const [availableGames, setAvailableGames] = useImmer<PrismaGame[]>([]);
  const [gameshow, setGameshow] = useImmer<TGameshowConfig>(
    DEFAULT_GAMESHOW_CONFIG
  );

  // api
  api.games.getAll.useQuery(undefined, {
    enabled: true,
    onError: (error) => handleZodError(error.data?.zodError, error.message),
    onSuccess(data) {
      setAvailableGames(data);
    }
  });

  api.gameshows.getById.useQuery(
    { gameshowId: gameshowId ?? "" },
    {
      enabled: !!gameshowId,
      onError: (error) => handleZodError(error.data?.zodError, error.message),
      onSuccess(data) {
        const gameshowConfig: TGameshowConfig = {
          name: data.name,
          games: data.games as GameState[]
        };
        setGameshow(gameshowConfig);
      }
    }
  );

  return (
    <GameConfigContext.Provider
      value={{ gameshow, setGameshow, availableGames, setAvailableGames }}
    >
      {children}
    </GameConfigContext.Provider>
  );
};

export { GameConfigContext, GameConfigProvider };
