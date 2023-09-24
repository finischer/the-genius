import { type Socket } from "socket.io";
import type {
  IClientToServerEvents,
  IServerSocketData,
  IServerToClientEvents,
} from "~/types/socket.types";

export default class NoRoomException {
  constructor(
    socket: Socket<
      IClientToServerEvents,
      IServerToClientEvents,
      IServerSocketData
    > &
      IServerSocketData
  ) {
    socket.emit("raiseException", {
      reason: "noRoomException",
      msg: "This room does not exist anymore",
    });
    console.error(`Room '${socket.roomId ?? "NO_ROOM_ID_FOUND"}' not found`);
  }
}
