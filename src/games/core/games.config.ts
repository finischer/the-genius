/**
 * EINFACHE GAME-KONFIGURATION
 *
 * Alle Spiele werden hier zentral konfiguriert.
 * Neues Spiel hinzufügen = nur eine Zeile Code!
 */

import React from "react";
import { Game } from "./types";
import type { GameState } from "./types";

// Import aller Default States
import { DEFAULT_MERKEN_STATE } from "../Merken/config";
import { DEFAULT_FLAGGEN_STATE } from "../Flaggen/config";
import { DEFAULT_GEHEIMWOERTER_STATE } from "../Geheimwörter/config";
import { DEFAULT_SET_STATE } from "../Set/config";
import { DEFAULT_DUSAGST_STATE } from "../DuSagst/config";
import { DEFAULT_REFERAT_BINGO_STATE } from "../ReferatBingo/config";
import { DEFAULT_ZEHN_SETZEN_STATE } from "../ZehnSetzen/config";
import { DEFAULT_FRAGENHAGEL_STATE } from "../Fragenhagel/config";

// Import aller Konfiguratoren
import MerkenConfigurator from "~/components/gameshows/MerkenConfigurator/MerkenConfigurator";
import FlaggenConfigurator from "~/components/gameshows/FlaggenConfigurator/FlaggenConfigurator";
import GeheimwörterConfigurator from "~/components/gameshows/GeheimwörterConfigurator/GeheimwörterConfigurator";
import SetConfigurator from "~/components/gameshows/SetConfigurator/SetConfigurator";
import DuSagstConfigurator from "~/components/gameshows/DuSagstConfigurator/DuSagstConfigurator";
import ReferatBingoConfigurator from "~/components/gameshows/ReferatBingoConfigurator/ReferatBingoConfigurator";
import ZehnSetzenConfigurator from "~/components/gameshows/ZehnSetzenConfigurator/ZehnSetzenConfigurator";
import FragenhagelConfigurator from "~/components/gameshows/FragenhagelConfigurator/FragenhagelConfigurator";

// Import aller Game-Komponenten
import MerkenGame from "../Merken/MerkenGame";
import FlaggenGame from "../Flaggen/FlaggenGame";
import GeheimwörterGame from "../Geheimwörter/GeheimwörterGame";
import SetGame from "../Set/SetGame";
import DuSagstGame from "../DuSagst/DuSagstGame";
import ReferatBingoGame from "../ReferatBingo/ReferatBingoGame";
import ZehnSetzenGame from "../ZehnSetzen/ZehnSetzen";
import FragenhagelGame from "../Fragenhagel/FragenhagelGame";

/**
 * GAME-KONFIGURATION
 * Neues Spiel? Einfach hier eine Zeile hinzufügen!
 */
export const GAME_CONFIGS: Array<{
  identifier: Game;
  name: string;
  defaultState: GameState;
  configurator?: React.ComponentType<unknown>;
  gameComponent?: React.ComponentType<unknown>;
}> = [
  {
    identifier: Game.MERKEN,
    name: "Merken",
    defaultState: DEFAULT_MERKEN_STATE,
    configurator: MerkenConfigurator,
    gameComponent: MerkenGame as React.ComponentType<unknown>
  },
  {
    identifier: Game.FLAGGEN,
    name: "Flaggen",
    defaultState: DEFAULT_FLAGGEN_STATE,
    configurator: FlaggenConfigurator,
    gameComponent: FlaggenGame as React.ComponentType<unknown>
  },
  {
    identifier: Game.GEHEIMWOERTER,
    name: "Geheimwörter",
    defaultState: DEFAULT_GEHEIMWOERTER_STATE,
    configurator: GeheimwörterConfigurator,
    gameComponent: GeheimwörterGame as React.ComponentType<unknown>
  },
  {
    identifier: Game.SET,
    name: "Set",
    defaultState: DEFAULT_SET_STATE,
    configurator: SetConfigurator,
    gameComponent: SetGame as React.ComponentType<unknown>
  },
  {
    identifier: Game.DUSAGST,
    name: "Du Sagst",
    defaultState: DEFAULT_DUSAGST_STATE,
    configurator: DuSagstConfigurator,
    gameComponent: DuSagstGame as React.ComponentType<unknown>
  },
  {
    identifier: Game.REFERATBINGO,
    name: "Referat Bingo",
    defaultState: DEFAULT_REFERAT_BINGO_STATE,
    configurator: ReferatBingoConfigurator,
    gameComponent: ReferatBingoGame as React.ComponentType<unknown>
  },
  {
    identifier: Game.ZEHN_SETZEN,
    name: "Zehn Setzen",
    defaultState: DEFAULT_ZEHN_SETZEN_STATE,
    configurator: ZehnSetzenConfigurator,
    gameComponent: ZehnSetzenGame as React.ComponentType<unknown>
  },
  {
    identifier: Game.FRAGENHAGEL,
    name: "Fragenhagel",
    defaultState: DEFAULT_FRAGENHAGEL_STATE,
    configurator: FragenhagelConfigurator,
    gameComponent: FragenhagelGame as React.ComponentType<unknown>
  }
  // 🎯 BEISPIEL: So einfach ist es, ein neues Spiel hinzuzufügen!
  // Siehe /src/examples/ für vollständige Implementierung:
  //
  // {
  //   identifier: Game.EXAMPLE_GAME,
  //   name: "Beispiel Spiel",
  //   defaultState: DEFAULT_EXAMPLE_GAME_STATE,
  //   configurator: ExampleGameConfigurator,
  //   gameComponent: ExampleGame as React.ComponentType<unknown>,
  // },
  //
  // Das war's! Keine weiteren Dateien nötig! 🚀
];

/**
 * Automatische Plugin-Generierung
 * VEREINFACHT: Wir brauchen keine komplexe Plugin-Struktur mehr!
 */
export const GENERATED_PLUGINS = Object.fromEntries(
  GAME_CONFIGS.map((config) => [
    config.identifier,
    {
      identifier: config.identifier,
      name: config.name,
      state: config.defaultState,
      configurator: config.configurator || (() => null),
      gameComponent: (config.gameComponent ||
        (() =>
          React.createElement(
            "div",
            {},
            "Loading..."
          ))) as React.ComponentType<{ game: unknown }>
    }
  ])
);

/**
 * Export für Kompatibilität mit altem System
 */
export const GAME_STATE_MAP = Object.fromEntries(
  GAME_CONFIGS.map((config) => [config.identifier, config.defaultState])
) as Partial<Record<Game, GameState>>;

export const GAME_CONFIGURATORS = Object.fromEntries(
  GAME_CONFIGS.map((config) => [config.identifier, config.configurator])
) as Partial<Record<Game, React.ComponentType<unknown>>>;

export const GAME_COMPONENTS = Object.fromEntries(
  GAME_CONFIGS.map((config) => [config.identifier, config.gameComponent])
) as Partial<Record<Game, React.ComponentType<unknown>>>;

export const GAME_NAMES = Object.fromEntries(
  GAME_CONFIGS.map((config) => [config.identifier, config.name])
) as Partial<Record<Game, string>>;
