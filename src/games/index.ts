/**
 * Zentrales Games-System
 *
 * Dieses Modul exportiert alles, was für die Games benötigt wird:
 * - Typen
 * - Plugin-System
 * - Registry
 * - Konstanten
 */

// Core-Typen
export * from "./core/types";

// Plugin-System
export * from "./core/plugin-system";

// Registry
export * from "./core/registry";

// Konstanten
export * from "./core/constants";

// Re-export für Backward-Kompatibilität
export { Game } from "./core/types";
export type {
  IGameProps,
  GameState,
  TGameSettingsMap,
  IGameGeneralState
} from "./core/types";
