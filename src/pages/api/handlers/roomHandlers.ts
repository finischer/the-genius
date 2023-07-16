import { type Server, type Socket } from "socket.io";
import {
  type IServerToClientEvents,
  type IClientToServerEvents,
  type IServerSocketData,
} from "~/types/socket.types";
import { roomManager } from "../controllers/RoomManager";
import NoRoomException from "../exceptions/NoRoomException";

// const prisma = new PrismaClient();

export function roomHandler(
  io: Server,
  socket: Socket<
    IClientToServerEvents,
    IServerToClientEvents,
    IServerSocketData
  > &
    IServerSocketData
) {
  socket.on("joinRoom", async ({ user, roomId }, cb) => {
    const room = roomManager.getRoom(roomId);

    if (!room) return new NoRoomException(socket);

    socket.user = {
      id: user.id,
      name: user.username,
    };
    socket.roomId = roomId;
    await socket.join(roomId);

    // const allSockets = await io.in(roomId).fetchSockets();

    cb(room);
  });

  socket.on("leaveRoom", async ({ roomId }) => {
    if (socket.roomId === roomId) {
      socket.to(roomId).emit("userLeftRoom", { user: socket.user || null });
      await socket.leave(roomId);
      socket.roomId = null;
    }
  });
}
