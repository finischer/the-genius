import { type User } from "@prisma/client";
import { type NextApiResponse } from "next";
import { type Server, type Socket } from "socket.io";
import type Room from "~/pages/api/classes/Room/Room";

type TSocketUser = {
  id: string;
  name: string;
};

export interface IServerSocketData extends Socket {
  user?: TSocketUser;
  roomId?: string;
}

export interface IClientToServerEvents {
  joinRoom: (
    { user, roomId }: { user: User; roomId: string },
    cb: (room: Room) => void
  ) => void;
  getOnlinePlayers: (
    cb: (response: { numOfOnlinePlayers: number }) => void
  ) => void;
}

export interface TNextApiResponse extends NextApiResponse {
  socket: NextApiResponse["socket"] & { server: { io?: Server } };
}
