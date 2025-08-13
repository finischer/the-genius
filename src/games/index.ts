export * from "./core/types";

// NEUE EINFACHE REGISTRY (ersetzt das komplexe Plugin-System)
export * from "./core/games.config";

// Re-export für Backward-Kompatibilität
export { Game } from "./core/types";
export type {
  IGameProps,
  GameState,
  TGameSettingsMap,
  IGameGeneralState
} from "./core/types";
