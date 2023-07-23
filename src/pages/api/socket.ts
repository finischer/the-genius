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
  console.log("Execute Socket handler");
  // means that socket server was already initialized
  if (res.socket.server.io) {
    console.log("Socket handler already initialized");
    res.end();
    return;
  }

  console.log("New Socket handler will be initialized");

  io = new Server(
    // @ts-ignore
    res.socket.server,
    {
      path: "/api/socket/",
      addTrailingSlash: false,
    }
  );
  res.socket.server.io = io;

  console.log("Initialize Server done. Now starting to fetch rooms from db");
  // initialize saved rooms for e.g. after a server crash
  const rooms = await prisma.room.findMany();

  console.log("Rooms found: ", rooms.length);
  rooms.forEach(async (room) => {
    const { id, name, creatorId, modus, games, isPrivate } = room;
    const user = await prisma.user.findUnique({
      where: {
        id: creatorId,
      },
    });

    const tmpRoom = new Room(id, name, isPrivate, user, modus, games);

    roomManager.addRoom(tmpRoom);
  });

  const onConnection = async (
    socket: Socket<
      IClientToServerEvents,
      IServerToClientEvents,
      IServerSocketData
    >
  ) => {
    console.log("Socket connected: ", socket.id);
    // const sockets = await io.fetchSockets();
    // io.emit("getOnlinePlayers", { numOfOnlinePlayers: sockets.length });

    // socket.on("disconnecting", async () => {
    //   const sockets = await io.fetchSockets();
    //   io.emit("getOnlinePlayers", { numOfOnlinePlayers: sockets.length - 1 });
    // });

    // initialize all handlers
    roomHandler(io, socket);
    teamHandler(io, socket);
  };

  io.on("connection", onConnection);

  res.end();
}
