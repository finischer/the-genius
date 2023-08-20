import {
  GameshowMode,
  type RoomTeams,
  type Room as PrismaRoom,
} from "@prisma/client";
import type Team from "../Team/Team";
import type { TGame } from "~/components/room/Game/games/game.types";

export type TRoomTeams = Omit<RoomTeams, "teamOne" | "teamTwo"> & {
  teamOne: Team;
  teamTwo: Team;
};

// type where type of games is set correctly
export type PrismaRoomFixed = Omit<PrismaRoom, "games"> & {
  games: TGame[];
};

export type IRoomMaxPlayersTeamMap = {
  [key in GameshowMode]: number;
};
