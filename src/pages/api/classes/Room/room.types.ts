import { type GameshowMode, type RoomTeams, type Room as PrismaRoom, Prisma } from "@prisma/client";
import type Team from "../Team/Team";
import type { TGame } from "~/components/room/Game/games/game.types";
import type Room from ".";

export type TeamOptions = keyof Room["teams"];

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

const roomInclude = Prisma.validator<Prisma.RoomInclude>()({
  creator: true,
});

export type PrismaRoomWithCreator = Prisma.RoomGetPayload<{
  include: typeof roomInclude;
}>;
