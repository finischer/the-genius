import { GamePluginManager } from "./plugin-system";

/**
 * Hauptregistry für alle Games
 * Hier werden alle Game-Plugins registriert und verwaltet
 *
 * WICHTIG: Neue Spiele müssen hier registriert werden!
 */

// Import aller Game-Plugins
import { merkenPlugin } from "../Merken/plugin";
import { flaggenPlugin } from "../Flaggen/plugin";
import { geheimwoerterPlugin } from "../Geheimwörter/plugin";
import { setPlugin } from "../Set/plugin";
import { duSagstPlugin } from "../DuSagst/plugin";
import { referatBingoPlugin } from "../ReferatBingo/plugin";
import { zehnSetzenPlugin } from "../ZehnSetzen/plugin";

/**
 * Registrierung aller Game Plugins
 * Hier müssen nur neue Spiele hinzugefügt werden!
 */
function registerAllPlugins() {
  // Registriere Merken Plugin
  GamePluginManager.registerPlugin(merkenPlugin);
  GamePluginManager.registerPlugin(flaggenPlugin);
  GamePluginManager.registerPlugin(geheimwoerterPlugin);
  GamePluginManager.registerPlugin(setPlugin);
  GamePluginManager.registerPlugin(duSagstPlugin);
  GamePluginManager.registerPlugin(referatBingoPlugin);
  GamePluginManager.registerPlugin(zehnSetzenPlugin);
}

// Registriere alle Plugins beim Import dieser Datei
registerAllPlugins();

// Export der Plugin-gesteuerten Maps (Ersatz für die alten separaten Maps)
export const GAME_STATE_MAP = GamePluginManager.getGameStateMap();
export const GAME_CONFIGURATORS = GamePluginManager.getConfigurators();
export const GAME_COMPONENTS = GamePluginManager.getGameComponents();
export const GAME_HANDLERS = GamePluginManager.getAllHandlers();

// Export des Plugin Managers für erweiterte Nutzung
export { GamePluginManager };
