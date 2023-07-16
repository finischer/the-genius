import { PrismaClient } from "@prisma/client";
import { type NextApiRequest } from "next";
import { Server, type Socket } from "socket.io";
import {
  type TNextApiResponse,
  type IClientToServerEvents,
  type IServerSocketData,
  type IServerToClientEvents,
} from "~/types/socket.types";
import Room from "./classes/Room/Room";
import { roomManager } from "./controllers/RoomManager";
import { roomHandler } from "./handlers/roomHandlers";
import { teamHandler } from "./handlers/teamHandlers";

const prisma = new PrismaClient();

export let io: Server<
  IClientToServerEvents,
  IServerToClientEvents,
  IServerSocketData
>;

export default async function SocketHandler(
  req: NextApiRequest,
  res: TNextApiResponse
) {
  // means that socket server was already initialised
  if (res.socket.server.io) {
    res.end();
    return;
  }

  io = new Server(
    // @ts-ignore
    res.socket.server,
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

  const onConnection = (
    socket: Socket<IClientToServerEvents, IServerSocketData>
  ) => {
    socket.on("getOnlinePlayers", async (cb) => {
      const sockets = await io.fetchSockets();

      const response = {
        numOfOnlinePlayers: sockets.length,
      };

      cb(response);
    });

    // initialize all handlers
    roomHandler(io, socket);
    teamHandler(io, socket);
  };

  io.on("connection", onConnection);

  res.end();
}