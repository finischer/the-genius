import type { Game as PrismaGame } from "~/generated/prisma/client";
import { useContext } from "react";
import { GameConfigContext } from "~/context/GameConfigProvider";
import type {
  IUseGameshowConfigReturn,
  TGameshowConfigKeys
} from "./useGameshowConfig.types";
import {
  GAME_STATE_MAP,
  GENERATED_PLUGINS,
  type Game,
  type GameState,
  type TGameSettingsMap
} from "~/games";

const useGameshowConfig = <T extends Game>(gameName: T) => {
  const gameConfigContext = useContext(GameConfigContext);

  if (gameConfigContext === undefined) {
    throw Error("useGameConfig must be used within GameConfigProvider");
  }

  const { gameshow, setGameshow, availableGames } = gameConfigContext;

  const updateGame = (updateFn: (config: TGameSettingsMap[T]) => void) => {
    if (!gameName) return;

    const gameIndex = gameshow.games.findIndex(
      (g) => g.identifier === gameName
    );

    if (gameIndex === -1) {
      console.error("Could not find game: ", gameName);
      return;
    }

    setGameshow((draft) => {
      // Rufe die übergebene Update-Funktion mit der aktuellen Spielkonfiguration auf
      updateFn(draft.games[gameIndex] as TGameSettingsMap[T]);
    });
  };

  const updateGameshowMetadata = (
    updateFn: (config: TGameshowConfigKeys) => void
  ) => {
    setGameshow((draft) => {
      // Rufe die übergebene Update-Funktion mit der aktuellen Spielkonfiguration auf
      updateFn(draft);
    });
  };

  const updateGameList = (newGameList: PrismaGame[]) => {
    const gameIdentifiers = newGameList.map((g) => g.slug);

    const newGames: GameState[] = [];

    gameIdentifiers.forEach((gId) => {
      const game = gameshow.games.find((g) => (g.identifier as string) === gId);

      if (game) {
        newGames.push(game);
      } else {
        const defaultGameState = GENERATED_PLUGINS[gId as Game]?.state;

        if (defaultGameState) {
          newGames.push(defaultGameState);
        }
      }
    });

    setGameshow((draft) => {
      draft.games = newGames;
    });
  };

  return {
    gameshow,
    updateGame,
    updateGameshowMetadata,
    updateGameList,
    availableGames,
    ...(gameName && {
      [gameName]:
        gameshow.games.find((g) => g.identifier === gameName) ??
        GAME_STATE_MAP[gameName]
    })
  } as IUseGameshowConfigReturn<T, typeof gameName>;
};

export { useGameshowConfig };
