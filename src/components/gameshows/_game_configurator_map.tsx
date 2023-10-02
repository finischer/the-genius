import type { TGameNames } from "../room/Game/games/game.types";
import DuSagstConfigurator from "./DuSagstConfigurator";
import FlaggenConfigurator from "./FlaggenConfigurator";
import GeheimwörterConfigurator from "./GeheimwörterConfigurator/GeheimwörterConfigurator";
import MemoryConfigurator from "./MemoryConfigurator/MemoryConfigurator";
import MerkenConfigurator from "./MerkenConfigurator/MerkenConfigurator";
import ReferatBingoConfigurator from "./ReferatBingoConfigurator";
import SetConfigurator from "./SetConfigurator";

export type TGameConfigurators = {
  [index in TGameNames]: React.ReactNode;
};

export const GAME_CONFIGURATORS: TGameConfigurators = {
  flaggen: <FlaggenConfigurator />,
  memory: <MemoryConfigurator />,
  merken: <MerkenConfigurator />,
  geheimwoerter: <GeheimwörterConfigurator />,
  set: <SetConfigurator />,
  duSagst: <DuSagstConfigurator />,
  referatBingo: <ReferatBingoConfigurator />,
};
