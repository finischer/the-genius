import type { FC } from "react";
import { type Game, GAME_CONFIGURATORS } from "~/games";

interface IGameConfigProps {
  gameSlug: Game;
}

const GameConfig: FC<IGameConfigProps> = ({ gameSlug }) => {
  // 🎯 GAME_CONFIGURATORS wird automatisch aus der neuen games.config.ts generiert!
  const ConfiguratorComponent = GAME_CONFIGURATORS[gameSlug];

  // Prüfe, ob eine gültige Konfigurationskomponente gefunden wurde
  if (!ConfiguratorComponent) {
    return <div>Keine Konfigurationskomponente für das Spiel gefunden</div>;
  }

  // Rufe die Konfigurationskomponente auf und gib sie zurück
  return <ConfiguratorComponent />;
};

export default GameConfig;
