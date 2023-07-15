import { type Socket } from "socket.io";

type TSocketUser = {
  id: string;
  name: string;
};

export interface IServerSocket extends Socket {
  user?: TSocketUser;
  roomId?: string;
}
