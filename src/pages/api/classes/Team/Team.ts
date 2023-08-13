import { randomUUID } from "crypto";
import { type TUserReduced } from "~/types/socket.types";
import Player from "../Player/Player";
import { type ITeam } from "./team.types";

export const SCOREBAR_TIMER_SECONDS = 5;

export default class Team implements ITeam {
  id: ITeam["id"];
  name: ITeam["name"];
  identifierKey: ITeam["identifierKey"];
  totalScore: ITeam["totalScore"];
  gameScore: ITeam["gameScore"];
  avatarImage: ITeam["avatarImage"];
  players: ITeam["players"];
  buzzer: ITeam["buzzer"];
  scorebarTimer: ITeam["scorebarTimer"];
  isActiveTurn: ITeam["isActiveTurn"];

  public constructor(name: string, identifierKey: string) {
    this.id = randomUUID();
    this.name = name;
    this.identifierKey = identifierKey;
    this.totalScore = 0;
    this.gameScore = 0;
    this.avatarImage = "";
    this.players = [];
    this.buzzer = {
      isPressed: false,
      playersBuzzered: [],
    };
    this.scorebarTimer = {
      isActive: false,
      seconds: SCOREBAR_TIMER_SECONDS,
    };
    this.isActiveTurn = false;
  }

  getPlayer(playerId: string) {
    for (const [playerKey, player] of Object.entries(this.players)) {
      if (player.id === playerId) {
        return {
          playerKey,
          playerNumber: playerKey === "playerOne" ? 0 : 1,
          ...player,
        };
      }
    }

    return null;
  }

  join(user: TUserReduced) {
    const newPlayer = new Player(user.id, this.id, user.username);

    this.players.push(newPlayer);
  }

  increaseGameScore(step = 1) {
    this.gameScore += step;
  }

  decreaseGameScore(step = 1) {
    if (this.gameScore === 0) return;
    this.gameScore -= step;
  }

  resetGameScore() {
    this.gameScore = 0;
  }

  increaseTotalScore(step = 1) {
    this.totalScore += step;
  }

  decreaseTotalScore(step = 1) {
    if (this.totalScore === 0) return;
    this.totalScore -= step;
  }

  resetTotalScore() {
    this.totalScore = 0;
  }

  startScorebarTimer() {
    this.scorebarTimer.isActive = true;
  }

  stopScorebarTimer() {
    this.scorebarTimer.isActive = false;
  }
}
