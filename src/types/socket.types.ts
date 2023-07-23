import { type User } from "@prisma/client";
import { type NextApiResponse } from "next";
import { type Server, type Socket } from "socket.io";
import { type ICreateRoomConfig } from "~/components/CreateRoomModal/createRoomModal.types";
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
  createRoom: (
    { user, roomConfig }: { user: TUserReduced; roomConfig: ICreateRoomConfig },
    cb: (room: Room) => void
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
}

export interface IServerToClientEvents {
  userLeftRoom: ({ user }: { user: TSocketUser | null }) => void;
  updateRoom: ({ newRoomState }: { newRoomState: Room }) => void;
  updateAllRooms: ({ newRooms }: { newRooms: Room[] }) => void;
  getOnlinePlayers: ({
    numOfOnlinePlayers,
  }: {
    numOfOnlinePlayers: number;
  }) => void;
}

export interface TNextApiResponse extends NextApiResponse {
  socket: NextApiResponse["socket"] & { server: { io?: Server } };
}
