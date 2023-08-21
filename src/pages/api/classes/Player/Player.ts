import type { PlayerStates, Player as PrismaPlayer } from "@prisma/client";
import { ObjectId } from "bson";
import type { TPlayer } from "./player.types";

export default class Player implements PrismaPlayer {
  id: string;
  name: string;
  userId: string;
  teamId: string;
  states: PlayerStates;

  public constructor(player: TPlayer) {
    this.id = new ObjectId().toString();
    this.name = player.name;
    this.userId = player.userId;
    this.teamId = player.teamId;
    this.states = {
      notefield: {
        isActive: false,
        value: "",
      },
    };
  }
}
