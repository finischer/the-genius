import { DEFAULT_DUSAGST_STATE } from "./DuSagst/config";
import { DEFAULT_FLAGGEN_STATE } from "./Flaggen/config";
import { DEFAULT_GEHEIMWOERTER_STATE } from "./Geheimwörter/config";
import { DEFAULT_MERKEN_STATE } from "./Merken/config";
import { DEFAULT_REFERAT_BINGO_STATE } from "./ReferatBingo/config";
import { DEFAULT_SET_STATE } from "./Set/config";
import type { TGameSettingsMap } from "./game.types";

export const GAME_STATE_MAP: TGameSettingsMap = {
  flaggen: DEFAULT_FLAGGEN_STATE,
  merken: DEFAULT_MERKEN_STATE,
  geheimwoerter: DEFAULT_GEHEIMWOERTER_STATE,
  set: DEFAULT_SET_STATE,
  duSagst: DEFAULT_DUSAGST_STATE,
  referatBingo: DEFAULT_REFERAT_BINGO_STATE,
};
