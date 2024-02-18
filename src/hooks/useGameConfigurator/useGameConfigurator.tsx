import { createContext, useContext, useEffect } from "react";
import { useImmer } from "use-immer";
import { DEFAULT_DUSAGST_STATE } from "~/components/room/Game/games/DuSagst/config";
import { DEFAULT_FLAGGEN_STATE } from "~/components/room/Game/games/Flaggen/config";
import { DEFAULT_GEHEIMWOERTER_STATE } from "~/components/room/Game/games/Geheimwörter/config";
import { DEFAULT_MERKEN_STATE } from "~/components/room/Game/games/Merken/config";
import { DEFAULT_REFERAT_BINGO_STATE } from "~/components/room/Game/games/ReferatBingo/config";
import { DEFAULT_SET_STATE } from "~/components/room/Game/games/Set/config";
import type { TGame, TGameNames } from "~/components/room/Game/games/game.types";
import {
  type IConfiguratorProvider,
  type TConfiguratorContext,
  type TGameSettingsMap,
  type TGameshowConfig,
} from "./useGameConfigurator.types";

export const GAME_STATE_MAP: TGameSettingsMap = {
  flaggen: DEFAULT_FLAGGEN_STATE,
  merken: DEFAULT_MERKEN_STATE,
  geheimwoerter: DEFAULT_GEHEIMWOERTER_STATE,
  set: DEFAULT_SET_STATE,
  duSagst: DEFAULT_DUSAGST_STATE,
  referatBingo: DEFAULT_REFERAT_BINGO_STATE,
};

export type TSelectedGameSettingsArray = TGame[];

type TGameshowConfigKeys = Omit<TGameshowConfig, "games">; // config of gameshow that can be adjust by the user at details screen

const GameConfiguratorContext = createContext<TConfiguratorContext | undefined>(undefined);

// Funktion zur Erstellung der gameSettingsMap
// TODO: Make function generic with type compatibility
function generateGameSettingsMap(gameshowConfig: TGameshowConfig): TGameSettingsMap {
  let gameSettingsMap: TGameSettingsMap = {
    flaggen: DEFAULT_FLAGGEN_STATE,
    merken: DEFAULT_MERKEN_STATE,
    geheimwoerter: DEFAULT_GEHEIMWOERTER_STATE,
    set: DEFAULT_SET_STATE,
    duSagst: DEFAULT_DUSAGST_STATE,
    referatBingo: DEFAULT_REFERAT_BINGO_STATE,
  };

  // Iteriere über die Spiele in gameshowConfig und fülle die gameSettingsMap entsprechend
  gameshowConfig.games.forEach((game: TGame) => {
    const gameConfig = gameSettingsMap[game.identifier];

    if (gameConfig) {
      // @ts-ignore
      gameSettingsMap[game.identifier] = game;
    }
  });

  return gameSettingsMap;
}

// function generateGameSettingsMap2<T extends TGameshowConfig>(gameshowConfig: T): TGameSettingsMap {
//   // Erstelle ein leeres Objekt für die gameSettingsMap
//   const gameSettingsMap: Partial<TGameSettingsMap> = {};

//   // Iteriere über die Spiele in gameshowConfig und fülle die gameSettingsMap entsprechend
//   gameshowConfig.games.forEach((game: TGame) => {
//     // Überprüfe, ob der Name des Spiels ein gültiger Schlüssel für die gameSettingsMap ist
//     if (game.identifier in gameSettingsMap) {
//       // Weise das Spiel der entsprechenden Eigenschaft in der gameSettingsMap zu
//       gameSettingsMap[game.name as keyof TGameSettingsMap] = game
//     } else {
//       // Unbekanntes Spiel
//       console.warn(`Unbekanntes Spiel "${game.name}"`);
//     }
//   });

//   // Rückgabe des vollständigen gameSettingsMap-Objekts
//   return gameSettingsMap as TGameSettingsMap;
// }

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

    selectedGames.forEach((gameName) => {
      newGameSettings.push(gameConfigs[gameName]);
    });

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
