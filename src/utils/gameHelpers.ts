import Handlebars from "handlebars";
import { Game, GENERATED_PLUGINS, type GameState } from "~/games";

export function getFormattedGameRules(game: GameState) {
  const metadata = {
    gameName: game.name,
    maxPoints: game.maxPoints,
    "maxPoints.equalOne": game.maxPoints === 1,
    modes: game.modes
  };

  let gameData = {};

  const rules =
    GENERATED_PLUGINS[game.identifier]?.state.rules ?? "Keine Regeln verfügbar";

  switch (game.identifier) {
    case Game.DUSAGST:
      gameData = {
        "timeToThinkSeconds.equalOne": game.timeToThinkSeconds === 1,
        timeToThinkSeconds: game.timeToThinkSeconds
      };
      break;
    case Game.MERKEN:
      gameData = {
        "timeToThinkSeconds.equalOne": game.timerState.timeToThinkSeconds === 1,
        timeToThinkSeconds: game.timerState.timeToThinkSeconds
      };
    default:
      break;
  }

  const data = {
    ...metadata,
    ...gameData
  };

  const template = Handlebars.compile(rules);

  return template(data);
}
