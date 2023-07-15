import { type User } from "@prisma/client";
import { type Socket } from "socket.io";
import type Room from "~/pages/api/classes/Room/Room";

type TSocketUser = {
  id: string;
  name: string;
};

export interface IServerSocket extends Socket {
  user?: TSocketUser;
  roomId?: string;
}

export interface IClientToServerEvents {
  joinRoom: (
    { user, roomId }: { user: User; roomId: string },
    cb: (room: Room) => void
  ) => void;
}
