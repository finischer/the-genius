import type { GamePlugin } from "../plugin-system";
import { Game } from "../game.types";
import { DEFAULT_MERKEN_STATE } from "./config";
import MerkenConfigurator from "~/components/gameshows/MerkenConfigurator/MerkenConfigurator";
import MerkenGame from "./MerkenGame";

/**
 * Merken Game Plugin
 */
export const merkenPlugin: GamePlugin = {
  identifier: Game.MERKEN,
  name: "Merken",
  defaultConfig: DEFAULT_MERKEN_STATE,
  configurator: MerkenConfigurator,
  gameComponent: MerkenGame as unknown as GamePlugin["gameComponent"],
  // Handler werden vorerst separat verwaltet
  handlers: undefined
};
