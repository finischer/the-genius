import type { ComponentType } from "react";
import type { Game, IGameGeneralState } from "./game.types";

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
  defaultConfig: IGameGeneralState;

  /** Konfigurator-Komponente für das Spiel */
  configurator: ComponentType<unknown>;

  /** Spiel-Komponente für die Ausführung */
  gameComponent: ComponentType<{ game: IGameGeneralState }>;

  /** Optionale Socket-Handler für das Spiel */
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
   * Gibt alle Default-Konfigurationen zurück
   */
  static getDefaultStates(): Record<Game, IGameGeneralState> {
    const states: Partial<Record<Game, IGameGeneralState>> = {};
    Object.values(this.plugins).forEach((plugin) => {
      states[plugin.identifier] = plugin.defaultConfig;
    });
    return states as Record<Game, IGameGeneralState>;
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
}
