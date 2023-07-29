import { type Socket } from "socket.io";

export default class NoRoomException extends Error {
  constructor(socket: Socket) {
    super();
    socket.emit("raiseException", {
      reason: "noRoomException",
      msg: "This room does not exist anymore",
    });

    throw new Error("Room not found");
  }
}
