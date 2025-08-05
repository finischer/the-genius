import type { GamePlugin } from "../plugin-system";
import { Game } from "../game.types";
import { DEFAULT_ZEHN_SETZEN_STATE } from "./config";
import ZehnSetzenConfigurator from "~/components/gameshows/ZehnSetzenConfigurator";
import ZehnSetzen from "./ZehnSetzen";

/**
 * ZehnSetzen Game Plugin
 */
export const zehnSetzenPlugin: GamePlugin = {
  identifier: Game.ZEHN_SETZEN,
  name: "Zehn setzen",
  defaultConfig: DEFAULT_ZEHN_SETZEN_STATE,
  configurator: ZehnSetzenConfigurator,
  gameComponent: ZehnSetzen as unknown as GamePlugin["gameComponent"],
  handlers: undefined
};
