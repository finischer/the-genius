import type { FC } from "react";
import type { Game } from "../games/game.types";
import { GAME_CONFIGURATORS } from "../games/game-registry";

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
