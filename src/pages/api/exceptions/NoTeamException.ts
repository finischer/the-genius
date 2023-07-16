import { type Socket } from "socket.io";

export default class NoTeamException {
  constructor(socket: Socket) {
    socket.emit("raiseException", {
      reason: "noTeamException",
      msg: "This team does not exist anymore",
    });
  }
}
