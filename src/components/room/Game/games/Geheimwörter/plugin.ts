import type { GamePlugin } from "../plugin-system";
import { Game } from "../game.types";
import { DEFAULT_GEHEIMWOERTER_STATE } from "./config";
import GeheimwörterConfigurator from "~/components/gameshows/GeheimwörterConfigurator/GeheimwörterConfigurator";
import GeheimwörterGame from "./GeheimwörterGame";

/**
 * Geheimwörter Game Plugin
 */
export const geheimwoerterPlugin: GamePlugin = {
  identifier: Game.GEHEIMWOERTER,
  name: "Geheimwörter",
  defaultConfig: DEFAULT_GEHEIMWOERTER_STATE,
  configurator: GeheimwörterConfigurator,
  gameComponent: GeheimwörterGame as unknown as GamePlugin["gameComponent"],
  handlers: undefined
};
