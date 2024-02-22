import { cloneDeep } from "lodash";
import { createContext, useContext, useEffect } from "react";
import { useImmer } from "use-immer";
import { GAME_STATE_MAP } from "~/components/room/Game/games/game.constants";
import type { TGame, TGameNames, TGameSettingsMap } from "~/components/room/Game/games/game.types";
import {
  type IConfiguratorProvider,
  type TConfiguratorContext,
  type TGameshowConfig,
} from "./useGameConfigurator.types";
export type TSelectedGameSettingsArray = TGame[];

type TGameshowConfigKeys = Omit<TGameshowConfig, "games">; // config of gameshow that can be adjust by the user at details screen

const GameConfiguratorContext = createContext<TConfiguratorContext | undefined>(undefined);

function generateGameSettingsMap(gameshowConfig: TGameshowConfig): TGameSettingsMap {
  const gameSettingsMap: TGameSettingsMap = cloneDeep(GAME_STATE_MAP);

  // Iteriere über die Spiele in gameshowConfig und fülle die gameSettingsMap entsprechend
  gameshowConfig.games.forEach((game: TGame) => {
    // @ts-ignore
    gameSettingsMap[game.identifier] = game;
  });

  return gameSettingsMap;
}

const GameConfiguratorProvider: React.FC<IConfiguratorProvider> = ({
  gameshow,
  updateGameshow,
  enableFurtherButton,
  disableFurtherButton,
  selectedGames,
  children,
}) => {
  const [gameConfigs, setGameConfigs] = useImmer<TGameSettingsMap>(generateGameSettingsMap(gameshow));

  useEffect(() => {
    const newGameSettings: TSelectedGameSettingsArray = [];

    console.log("SelectedGames: ", selectedGames);
    console.log("GameConfig: ", gameConfigs);
    selectedGames.forEach((gameName) => {
      newGameSettings.push(gameConfigs[gameName]);
    });

    console.log("New game settings: ", newGameSettings);

    updateGameshow((draft) => {
      draft.games = newGameSettings;
    });
  }, [gameConfigs, selectedGames.length]);

  return (
    <GameConfiguratorContext.Provider
      value={[
        gameConfigs,
        setGameConfigs,
        { enableFurtherButton, disableFurtherButton, updateGameshowMetadata: updateGameshow },
      ]}
    >
      {children}
    </GameConfiguratorContext.Provider>
  );
};

function useConfigurator<T extends TGameNames>(game: T) {
  const context = useContext(GameConfiguratorContext);

  if (context === undefined) {
    throw Error("useConfigurator must be used within ConfiguratorProvider");
  }

  const [gameConfigs, setGameConfigs, options] = context;

  const updateGameConfig = (updateFn: (config: TGameSettingsMap[T]) => void) => {
    setGameConfigs((draft) => {
      // Rufe die übergebene Update-Funktion mit der aktuellen Spielkonfiguration auf
      updateFn(draft[game]);
    });
  };

  const updateGameshowMetadata = (updateFn: (config: TGameshowConfigKeys) => void) => {
    options.updateGameshowMetadata((draft) => {
      // Rufe die übergebene Update-Funktion mit der aktuellen Spielkonfiguration auf
      updateFn(draft);
    });
  };

  return [gameConfigs[game], updateGameConfig, { ...options, updateGameshowMetadata }] as const;
}

export { GameConfiguratorProvider, useConfigurator };
