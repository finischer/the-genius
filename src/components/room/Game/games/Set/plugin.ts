import type { GamePlugin } from "../plugin-system";
import { Game } from "../game.types";
import { DEFAULT_SET_STATE } from "./config";
import SetConfigurator from "~/components/gameshows/SetConfigurator";
import SetGame from "./SetGame";

/**
 * Set Game Plugin
 */
export const setPlugin: GamePlugin = {
  identifier: Game.SET,
  name: "Set",
  defaultConfig: DEFAULT_SET_STATE,
  configurator: SetConfigurator,
  gameComponent: SetGame as unknown as GamePlugin["gameComponent"],
  handlers: undefined
};
