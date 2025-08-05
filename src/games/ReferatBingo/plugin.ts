import ReferatBingoConfigurator from "~/components/gameshows/ReferatBingoConfigurator";
import ReferatBingoGame from "./ReferatBingoGame";
import type { GamePlugin } from "../core/plugin-system";
import { Game } from "../core/types";
import { DEFAULT_REFERAT_BINGO_STATE } from "./config";

/**
 * ReferatBingo Game Plugin
 */
export const referatBingoPlugin: GamePlugin = {
  identifier: Game.REFERATBINGO,
  name: "Referat Bingo",
  state: DEFAULT_REFERAT_BINGO_STATE,
  configurator: ReferatBingoConfigurator,
  gameComponent: ReferatBingoGame as unknown as GamePlugin["gameComponent"],
  handlers: undefined
};
