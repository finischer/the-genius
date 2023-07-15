import { randomUUID } from "crypto";
import { type IPlayer } from "./player.types";

export default class Player implements IPlayer {
  id: IPlayer["id"];
  userId: IPlayer["userId"];
  teamId: IPlayer["teamId"];
  name: IPlayer["name"];

  public constructor(
    userId: IPlayer["userId"] = null,
    teamId: IPlayer["teamId"],
    name: IPlayer["name"] = null
  ) {
    this.id = randomUUID();
    this.userId = userId;
    this.teamId = teamId;
    this.name = name;
  }
}
