import { type Server, type Socket } from "socket.io";
import {
  type IServerToClientEvents,
  type IClientToServerEvents,
  type IServerSocketData,
} from "~/types/socket.types";
import { roomManager } from "../controllers/RoomManager";
import NoRoomException from "../exceptions/NoRoomException";
import NoTeamException from "../exceptions/NoTeamException";

// const prisma = new PrismaClient();

export function teamHandler(
  io: Server,
  socket: Socket<
    IClientToServerEvents,
    IServerToClientEvents,
    IServerSocketData
  > &
    IServerSocketData
) {
  socket.on("joinTeam", ({ user, teamId }, cb) => {
    const room = roomManager.getRoom(socket.roomId);

    if (!room) return new NoRoomException(socket);

    const team = room.getTeamById(teamId);

    if (!team) return new NoTeamException(socket);

    team.join(user);
    socket.teamId = teamId;
    room.update();
    cb();
  });
}
