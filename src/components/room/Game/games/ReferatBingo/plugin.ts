import type { GamePlugin } from "../plugin-system";
import { Game } from "../game.types";
import { DEFAULT_REFERAT_BINGO_STATE } from "./config";
import ReferatBingoConfigurator from "~/components/gameshows/ReferatBingoConfigurator";
import ReferatBingoGame from "./ReferatBingoGame";

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
