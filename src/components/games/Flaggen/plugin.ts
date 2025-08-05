import type { GamePlugin } from "../plugin-system";
import { Game } from "../game.types";
import { DEFAULT_FLAGGEN_STATE } from "./config";
import FlaggenConfigurator from "~/components/gameshows/FlaggenConfigurator";
import FlaggenGame from "./FlaggenGame";

/**
 * Flaggen Game Plugin
 */
export const flaggenPlugin: GamePlugin = {
  identifier: Game.FLAGGEN,
  name: "Flaggen",
  state: DEFAULT_FLAGGEN_STATE,
  configurator: FlaggenConfigurator,
  gameComponent: FlaggenGame as unknown as GamePlugin["gameComponent"],
  // Flaggen hat keine speziellen Socket-Handler
  handlers: undefined
};
