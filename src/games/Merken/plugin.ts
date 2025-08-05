import { DEFAULT_MERKEN_STATE } from "./config";
import MerkenConfigurator from "~/components/gameshows/MerkenConfigurator/MerkenConfigurator";
import MerkenGame from "./MerkenGame";
import { Game } from "../core/types";
import type { GamePlugin } from "../core/plugin-system";

/**
 * Merken Game Plugin
 */
export const merkenPlugin: GamePlugin = {
  identifier: Game.MERKEN,
  name: "Merken",
  state: DEFAULT_MERKEN_STATE,
  configurator: MerkenConfigurator,
  gameComponent: MerkenGame as unknown as GamePlugin["gameComponent"],
  // Handler werden vorerst separat verwaltet
  handlers: undefined
};
