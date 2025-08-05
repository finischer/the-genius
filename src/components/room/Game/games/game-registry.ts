import { GamePluginManager } from "./plugin-system";
import { flaggenPlugin } from "./Flaggen/plugin";
import { merkenPlugin } from "./Merken/plugin";
import { geheimwoerterPlugin } from "./Geheimwörter/plugin";
import { setPlugin } from "./Set/plugin";
import { duSagstPlugin } from "./DuSagst/plugin";
import { referatBingoPlugin } from "./ReferatBingo/plugin";
import { zehnSetzenPlugin } from "./ZehnSetzen/plugin";

/**
 * Registrierung aller Game Plugins
 * Hier müssen nur neue Spiele hinzugefügt werden!
 */
function registerAllPlugins() {
  GamePluginManager.registerPlugin(flaggenPlugin);
  GamePluginManager.registerPlugin(merkenPlugin);
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

// Export des Plugin Managers für erweiterte Nutzung
export { GamePluginManager };
