import { type Gameshow, type User } from "@prisma/client";
import { type NextApiResponse } from "next";
import { type Server, type Socket } from "socket.io";
import { type ICreateRoomConfig } from "~/components/CreateRoomModal/createRoomModal.types";
import { type TGameNames } from "~/games/game.types";
import type Room from "~/pages/api/classes/Room/Room";

type TSocketUser = {
  id: string;
  name: string;
};

export type TUserReduced = Omit<
  User,
  "emailVerified" | "password" | "gameshows" | "createdAt" | "updatedAt"
>;

export interface IServerSocketData extends Socket {
  user?: TSocketUser;
  roomId?: string | null;
  teamId?: string | null;
}

export interface IClientToServerEvents {
  // +++ ROOM EVENTS +++
  createRoom: (
    {
      user,
      roomConfig,
      gameshow,
    }: {
      user: TUserReduced;
      roomConfig: ICreateRoomConfig;
      gameshow: Gameshow;
    },
    cb: (room: Room) => void
  ) => void;
  closeRoom: (
    { roomId }: { roomId: string },
    cb?: ({ closeSuccessful }: { closeSuccessful: boolean }) => void
  ) => void;
  joinRoom: (
    { user, roomId }: { user: TUserReduced; roomId: string },
    cb: (room: Room) => void
  ) => void;
  leaveRoom: ({ roomId }: { roomId: string }) => void;
  joinTeam: (
    { user, teamId }: { user: TUserReduced; teamId: string },
    cb: () => void
  ) => void;
  listAllRooms: (cb: (rooms: Room[]) => void) => void;
  startGame: ({ gameIdentifier }: { gameIdentifier: TGameNames }) => void;

  // +++ TEAM EVENTS +++
  increaseGameScore: ({
    teamId,
    step,
  }: {
    teamId: string;
    step: number;
  }) => void;
  decreaseGameScore: ({
    teamId,
    step,
  }: {
    teamId: string;
    step: number;
  }) => void;
  resetGameScore: ({ teamId }: { teamId: string }) => void;
  increaseTotalScore: ({
    teamId,
    step,
  }: {
    teamId: string;
    step: number;
  }) => void;
  decreaseTotalScore: ({
    teamId,
    step,
  }: {
    teamId: string;
    step: number;
  }) => void;
  resetTotalScore: ({ teamId }: { teamId: string }) => void;
  toggleTeamActive: ({ teamId }: { teamId: string }) => void;
  releaseBuzzer: () => void;
}

export interface IServerToClientEvents {
  // +++ GENERAL EVENTS +++
  getOnlinePlayers: ({
    numOfOnlinePlayers,
  }: {
    numOfOnlinePlayers: number;
  }) => void;

  // +++ ROOM EVENTS +++
  userLeftRoom: ({ user }: { user: TSocketUser | null }) => void;
  updateRoom: ({ newRoomState }: { newRoomState: Room }) => void;
  updateAllRooms: ({ newRooms }: { newRooms: Room[] }) => void;
  roomWasClosed: () => void;
}

export interface TNextApiResponse extends NextApiResponse {
  socket: NextApiResponse["socket"] & { server: { io?: Server } };
}
