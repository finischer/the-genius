import { DEFAULT_SET_STATE } from "./config";
import SetConfigurator from "~/components/gameshows/SetConfigurator";
import SetGame from "./SetGame";
import { Game } from "../core/types";
import type { GamePlugin } from "../core/plugin-system";

/**
 * Set Game Plugin
 */
export const setPlugin: GamePlugin = {
  identifier: Game.SET,
  name: "Set",
  state: DEFAULT_SET_STATE,
  configurator: SetConfigurator,
  gameComponent: SetGame as unknown as GamePlugin["gameComponent"],
  handlers: undefined
};
