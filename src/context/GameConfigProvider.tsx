import { Children, createContext, useEffect, type FC, type ReactNode, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { TApiActions } from "~/server/api/api.types";
import { api } from "~/utils/api";
import type { Game } from "@prisma/client";
import type { Games, TGame, TGameSettingsMap } from "~/components/room/Game/games/game.types";
import useNotification from "~/hooks/useNotification";
import type { TGameshowConfig } from "~/hooks/useGameshowConfig/useGameshowConfig.types";
import { useImmer, type Updater } from "use-immer";

interface IGameConfigProviderProps {
  children: ReactNode;
}

export interface IGameConfigContextProps {
  gameshow: TGameshowConfig;
  setGameshow: Updater<TGameshowConfig>;
  availableGames: Game[];
  setAvailableGames: Updater<Game[]>;
}

const GameConfigContext = createContext<IGameConfigContextProps | undefined>(undefined);

const DEFAULT_GAMESHOW_CONFIG = {
  name: "",
  games: [],
};

const GameConfigProvider: FC<IGameConfigProviderProps> = ({ children }) => {
  const searchParams = useSearchParams();
  const { handleZodError } = useNotification();

  const gameshowId = searchParams.get("gameshowId");
  const action: TApiActions = (searchParams.get("action") as TApiActions) ?? "create";

  const [availableGames, setAvailableGames] = useImmer<Game[]>([]);
  const [gameshow, setGameshow] = useImmer<TGameshowConfig>(DEFAULT_GAMESHOW_CONFIG);

  // api
  const {
    refetch: fetchAvailableGames,
    isLoading: isLoadingAllAvailableGames,
    isFetching: isFetchingAvailableGames,
  } = api.games.getAll.useQuery(undefined, {
    enabled: true,
    onError: (error) => handleZodError(error.data?.zodError, error.message),
    onSuccess(data) {
      console.log("Fetch available games - Success!");
      setAvailableGames(data);
    },
  });

  const { refetch: fetchGameshow, isFetching: isFetchingGameshow } = api.gameshows.getById.useQuery(
    { gameshowId: gameshowId ?? "" },
    {
      enabled: !!gameshowId,
      onError: (error) => handleZodError(error.data?.zodError, error.message),
      onSuccess(data) {
        console.log("Fetch gameshow - Success!");

        const gameshowConfig: TGameshowConfig = {
          name: data.name,
          games: data.games as TGame[],
        };
        setGameshow(gameshowConfig);
      },
    }
  );

  useEffect(() => {
    console.log("Games: ", availableGames);
    console.log("Gameshow: ", gameshow);
  }, [availableGames, gameshow]);

  return (
    <GameConfigContext.Provider value={{ gameshow, setGameshow, availableGames, setAvailableGames }}>
      {children}
    </GameConfigContext.Provider>
  );
};

export { GameConfigProvider, GameConfigContext };
