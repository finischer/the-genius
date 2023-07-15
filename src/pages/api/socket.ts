import { Server, type Socket } from "socket.io";
import { roomHandler } from "./handlers/roomHandlers";
import {
  TNextApiResponse,
  type IClientToServerEvents,
  type IServerSocket,
} from "~/types/socket.types";
import { PrismaClient } from "@prisma/client";
import { roomManager } from "./controllers/RoomManager";
import Room from "./classes/Room/Room";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function SocketHandler(
  req: NextApiRequest,
  res: TNextApiResponse
) {
  // means that socket server was already initialised
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server<IClientToServerEvents, IServerSocket>(
    res.socket.server as any,
    {
      path: "/api/socket/",
      addTrailingSlash: false,
    }
  );
  res.socket.server.io = io;

  // initialize saved rooms for e.g. after a server crash
  const rooms = await prisma.room.findMany();

  rooms.forEach(async (room) => {
    const { id, name, password, creatorId, modus, games } = room;
    const user = await prisma.user.findUnique({
      where: {
        id: creatorId,
      },
    });

    const numOfPlayers = modus === "DUELL" ? 2 : 4;

    const tmpRoom = new Room(
      id,
      name,
      password !== null,
      user,
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
