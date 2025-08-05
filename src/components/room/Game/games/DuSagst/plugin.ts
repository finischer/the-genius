import type { GamePlugin } from "../plugin-system";
import { Game } from "../game.types";
import { DEFAULT_DUSAGST_STATE } from "./config";
import DuSagstConfigurator from "~/components/gameshows/DuSagstConfigurator";
import DuSagstGame from "./DuSagstGame";

/**
 * DuSagst Game Plugin
 */
export const duSagstPlugin: GamePlugin = {
  identifier: Game.DUSAGST,
  name: "Du sagst",
  defaultConfig: DEFAULT_DUSAGST_STATE,
  configurator: DuSagstConfigurator,
  gameComponent: DuSagstGame as unknown as GamePlugin["gameComponent"],
  handlers: undefined
};
