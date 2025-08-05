import { DEFAULT_ZEHN_SETZEN_STATE } from "./config";
import ZehnSetzenConfigurator from "~/components/gameshows/ZehnSetzenConfigurator";
import ZehnSetzen from "./ZehnSetzen";
import { Game } from "../core/types";
import type { GamePlugin } from "../core/plugin-system";

/**
 * ZehnSetzen Game Plugin
 */
export const zehnSetzenPlugin: GamePlugin = {
  identifier: Game.ZEHN_SETZEN,
  name: "Zehn setzen",
  state: DEFAULT_ZEHN_SETZEN_STATE,
  configurator: ZehnSetzenConfigurator,
  gameComponent: ZehnSetzen as unknown as GamePlugin["gameComponent"],
  handlers: undefined
};
