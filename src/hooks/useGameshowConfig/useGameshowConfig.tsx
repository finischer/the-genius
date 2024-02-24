import type { Game } from "@prisma/client";
import { useContext } from "react";
import { GAME_STATE_MAP } from "~/components/room/Game/games/game.constants";
import { Games, type TGame, type TGameSettingsMap } from "~/components/room/Game/games/game.types";
import { GameConfigContext } from "~/context/GameConfigProvider";
import type { IUseGameshowConfigReturn, TGameshowConfigKeys } from "./useGameshowConfig.types";

const useGameshowConfig = <T extends Games>(gameName: T) => {
  const gameConfigContext = useContext(GameConfigContext);

  if (gameConfigContext === undefined) {
    throw Error("useGameConfig must be used within GameConfigProvider");
  }

  const { gameshow, setGameshow, availableGames } = gameConfigContext;

  const updateGame = (updateFn: (config: TGameSettingsMap[T]) => void) => {
    if (!gameName) return;

    console.log("updateGame - Games: ", gameshow.games);

    const gameIndex = gameshow.games.findIndex((g) => g.identifier === gameName);

    if (gameIndex === -1) {
      console.log("Could not find game: ", gameName);
      return;
    }

    setGameshow((draft) => {
      // Rufe die übergebene Update-Funktion mit der aktuellen Spielkonfiguration auf
      updateFn(draft.games[gameIndex] as TGameSettingsMap[T]);
    });
  };

  const updateGameshowMetadata = (updateFn: (config: TGameshowConfigKeys) => void) => {
    setGameshow((draft) => {
      // Rufe die übergebene Update-Funktion mit der aktuellen Spielkonfiguration auf
      updateFn(draft);
    });
  };

  const updateGameList = (newGameList: Game[]) => {
    const gameIdentifiers = newGameList.map((g) => g.slug);

    const newGames: TGame[] = [];

    gameIdentifiers.forEach((gId) => {
      const game = gameshow.games.find((g) => g.identifier === gId);

      if (game) {
        newGames.push(game);
      } else {
        newGames.push(GAME_STATE_MAP[gId as Games]);
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
      [gameName]: gameshow.games.find((g) => g.identifier === gameName) ?? GAME_STATE_MAP[gameName],
    }),
  } as IUseGameshowConfigReturn<T, typeof gameName>;
};

export { useGameshowConfig };
