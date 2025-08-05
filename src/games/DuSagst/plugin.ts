import { DEFAULT_DUSAGST_STATE } from "./config";
import DuSagstConfigurator from "~/components/gameshows/DuSagstConfigurator";
import DuSagstGame from "./DuSagstGame";
import { Game } from "../core/types";
import type { GamePlugin } from "../core/plugin-system";

/**
 * DuSagst Game Plugin
 */
export const duSagstPlugin: GamePlugin = {
  identifier: Game.DUSAGST,
  name: "Du sagst",
  state: DEFAULT_DUSAGST_STATE,
  configurator: DuSagstConfigurator,
  gameComponent: DuSagstGame as unknown as GamePlugin["gameComponent"],
  handlers: undefined
};
