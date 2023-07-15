import { Server, type Socket } from "socket.io";
import { roomHandler } from "./handlers/roomHandlers";
import { IServerSocket } from "~/types/socket.types";
import { PrismaClient } from "@prisma/client";
import { roomManager } from "./controllers/RoomManager";
import Room from "./classes/Room/Room";

const prisma = new PrismaClient();

// @ts-expect-error sdf
export default async function SocketHandler(req, res) {
  // means that socket server was already initialised
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io: Server = new Server(res.socket.server, {
    path: "/api/socket/",
    addTrailingSlash: false,
  });
  res.socket.server.io = io;

  // initialize saved rooms for e.g. after a server crash
  const rooms = await prisma.room.findMany();

  rooms.forEach((room) => {
    const { id, name, password, creatorId, modus, games } = room;
    const numOfPlayers = modus === "DUELL" ? 2 : 4;

    const tmpRoom = new Room(
      id,
      name,
      password !== null,
      creatorId,
      numOfPlayers,
      modus,
      games
    );

    roomManager.addRoom(tmpRoom);
  });

  const onConnection = (socket: Socket) => {
    socket.on("getOnlinePlayers", async (cb) => {
      const sockets = await io.fetchSockets();

      const response = {
        numOfOnlinePlayers: sockets.length,
      };

      cb(response);
    });

    // initialize all handlers
    roomHandler(io, socket as IServerSocket);
  };

  io.on("connection", onConnection);

  res.end();
}
