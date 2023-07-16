import { type User } from "@prisma/client";
import { type NextApiResponse } from "next";
import { type Server, type Socket } from "socket.io";
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
}

export interface IClientToServerEvents {
  joinRoom: (
    { user, roomId }: { user: TUserReduced; roomId: string },
    cb: (room: Room) => void
  ) => void;
  leaveRoom: ({ roomId }: { roomId: string }) => void;
  getOnlinePlayers: (
    cb: (response: { numOfOnlinePlayers: number }) => void
  ) => void;
}

export interface IServerToClientEvents {
  userLeftRoom: ({ user }: { user: TSocketUser | null }) => void;
}

export interface TNextApiResponse extends NextApiResponse {
  socket: NextApiResponse["socket"] & { server: { io?: Server } };
}
