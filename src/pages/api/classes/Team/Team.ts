import { randomUUID } from "crypto";
import Player from "../Player/Player";
import { type ITeam } from "./team.types";

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
    this.players = {
      playerOne: new Player(null, this.id, null),
      playerTwo: new Player(null, this.id, null),
    };
    this.buzzer = {
      isPressed: false,
      playerBuzzered: "",
    };
    this.scorebarTimer = {
      isActive: false,
      seconds: 5,
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
}
