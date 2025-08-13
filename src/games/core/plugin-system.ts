import type { ComponentType } from "react";
import type { Game, IGameGeneralState, GameState } from "./types";

/**
 * Plugin-Interface für Spiele
 * Vereinfachte Version ohne komplexe Generics
 */
export interface GamePlugin {
  /** Eindeutiger Identifier des Spiels */
  identifier: Game;

  /** Anzeigename des Spiels */
  name: string;

  /** Default-Konfiguration des Spiels */
  state: GameState;

  /** Konfigurator-Komponente für das Spiel */
  configurator: ComponentType<unknown>;

  /** Spiel-Komponente für die Ausführung */
  gameComponent: ComponentType<{ game: IGameGeneralState }>;

  /** Optionale Event-Handler für das Spiel */
  handlers?: Record<string, (...args: unknown[]) => unknown>;
}

/**
 * Registry für alle Game Plugins
 */
export interface GamePluginRegistry {
  [key: string]: GamePlugin;
}

/**
 * Plugin Manager für die Verwaltung aller Spiele
 */
export class GamePluginManager {
  private static plugins: GamePluginRegistry = {};

  /**
   * Registriert ein neues Game Plugin
   */
  static registerPlugin(plugin: GamePlugin): void {
    this.plugins[plugin.identifier] = plugin;
  }

  /**
   * Gibt alle registrierten Plugins zurück
   */
  static getAllPlugins(): GamePluginRegistry {
    return this.plugins;
  }

  /**
   * Gibt ein spezifisches Plugin zurück
   */
  static getPlugin(identifier: Game): GamePlugin | undefined {
    return this.plugins[identifier];
  }

  /**
   * Gibt alle Spielzustände zurück
   */
  static getGameStateMap(): Record<Game, GameState> {
    const states: Partial<Record<Game, GameState>> = {};
    Object.values(this.plugins).forEach((plugin) => {
      states[plugin.identifier] = plugin.state;
    });
    return states as Record<Game, GameState>;
  }

  /**
   * Gibt alle Konfiguratoren zurück
   */
  static getConfigurators(): Record<Game, ComponentType<unknown>> {
    const configurators: Partial<Record<Game, ComponentType<unknown>>> = {};
    Object.values(this.plugins).forEach((plugin) => {
      configurators[plugin.identifier] = plugin.configurator;
    });
    return configurators as Record<Game, ComponentType<unknown>>;
  }

  /**
   * Gibt alle Game-Komponenten zurück
   */
  static getGameComponents(): Record<
    Game,
    ComponentType<{ game: IGameGeneralState }>
  > {
    const components: Partial<
      Record<Game, ComponentType<{ game: IGameGeneralState }>>
    > = {};
    Object.values(this.plugins).forEach((plugin) => {
      components[plugin.identifier] = plugin.gameComponent;
    });
    return components as Record<
      Game,
      ComponentType<{ game: IGameGeneralState }>
    >;
  }

  /**
   * Gibt alle Handler zurück
   */
  static getAllHandlers(): Record<string, (...args: unknown[]) => unknown> {
    const allHandlers: Record<string, (...args: unknown[]) => unknown> = {};
    Object.values(this.plugins).forEach((plugin) => {
      if (plugin.handlers) {
        Object.assign(allHandlers, plugin.handlers);
      }
    });
    return allHandlers;
  }

  /**
   * Hilfsmethode: Gibt alle Game-Namen zurück
   */
  static getAllGameNames(): Record<Game, string> {
    const names: Partial<Record<Game, string>> = {};
    Object.values(this.plugins).forEach((plugin) => {
      names[plugin.identifier] = plugin.name;
    });
    return names as Record<Game, string>;
  }
}
