import { type Server } from "socket.io";
import { type IServerSocket } from "~/types/socket.types";
import { roomManager } from "../controllers/RoomManager";
import NoRoomException from "../exceptions/NoRoomException";

// const prisma = new PrismaClient();

export function roomHandler(io: Server, socket: IServerSocket) {
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
}
