import Handlebars from "handlebars";
import { GAME_STATE_MAP } from "~/components/room/Game/games/game.constants";
import { Games, type TGame } from "~/components/room/Game/games/game.types";

export function getFormattedGameRules(game: TGame) {
  const metadata = {
    gameName: game.name,
    maxPoints: game.maxPoints,
    "maxPoints.equalOne": game.maxPoints === 1,
    modes: game.modes,
  };

  let gameData = {};

  const rules = GAME_STATE_MAP[game.identifier].rules;

  switch (game.identifier) {
    case Games.DUSAGST:
      gameData = {
        "timeToThinkSeconds.equalOne": game.timeToThinkSeconds === 1,
        timeToThinkSeconds: game.timeToThinkSeconds,
      };
      break;
    case Games.MERKEN:
      gameData = {
        "timeToThinkSeconds.equalOne": game.timerState.timeToThinkSeconds === 1,
        timeToThinkSeconds: game.timerState.timeToThinkSeconds,
      };
    default:
      break;
  }

  const data = {
    ...metadata,
    ...gameData,
  };

  const template = Handlebars.compile(rules);

  return template(data);
}

export function getDefaultGameState<T extends Games>(gameName: T) {
  return GAME_STATE_MAP[gameName];
}
