import { DEFAULT_GEHEIMWOERTER_STATE } from "./config";
import GeheimwörterConfigurator from "~/components/gameshows/GeheimwörterConfigurator/GeheimwörterConfigurator";
import GeheimwörterGame from "./GeheimwörterGame";
import { Game } from "../core/types";
import type { GamePlugin } from "../core/plugin-system";

/**
 * Geheimwörter Game Plugin
 */
export const geheimwoerterPlugin: GamePlugin = {
  identifier: Game.GEHEIMWOERTER,
  name: "Geheimwörter",
  state: DEFAULT_GEHEIMWOERTER_STATE,
  configurator: GeheimwörterConfigurator,
  gameComponent: GeheimwörterGame as unknown as GamePlugin["gameComponent"],
  handlers: undefined
};
