import { type Socket } from "socket.io";

export default class NoRoomException {
  constructor(socket: Socket) {
    socket.emit("raiseException", {
      reason: "noRoomException",
      msg: "This room does not exist anymore",
    });
  }
}
