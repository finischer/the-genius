import type { FC } from "react";
import type { Game } from "../room/Game/games/game.types";
import DuSagstConfigurator from "./DuSagstConfigurator";
import FlaggenConfigurator from "./FlaggenConfigurator";
import GeheimwörterConfigurator from "./GeheimwörterConfigurator/GeheimwörterConfigurator";
import MerkenConfigurator from "./MerkenConfigurator/MerkenConfigurator";
import ReferatBingoConfigurator from "./ReferatBingoConfigurator";
import SetConfigurator from "./SetConfigurator";

export type TGameConfigurators = {
  [index in Game]: React.ComponentType<any>;
};

export const GAME_CONFIGURATORS: TGameConfigurators = {
  flaggen: FlaggenConfigurator,
  merken: MerkenConfigurator,
  geheimwoerter: GeheimwörterConfigurator,
  set: SetConfigurator,
  duSagst: DuSagstConfigurator,
  referatBingo: ReferatBingoConfigurator,
};

interface IGameConfigProps {
  gameSlug: Game;
}

const GameConfig: FC<IGameConfigProps> = ({ gameSlug }) => {
  const ConfiguratorComponent = GAME_CONFIGURATORS[gameSlug]; // Hole die entsprechende Konfigurationskomponente

  // Prüfe, ob eine gültige Konfigurationskomponente gefunden wurde
  if (!ConfiguratorComponent) {
    return <div>Keine Konfigurationskomponente für das Spiel gefunden</div>;
  }

  // Rufe die Konfigurationskomponente auf und gib sie zurück
  return <ConfiguratorComponent />;
};

export default GameConfig;
