import { PrismaClient } from "@prisma/client";
import { instrument } from "@socket.io/admin-ui";
import { type NextApiRequest } from "next";
import { Server, type Socket } from "socket.io";
import { env } from "~/env.mjs";
import {
  type IClientToServerEvents,
  type IServerSocketData,
  type IServerToClientEvents,
  type TNextApiResponse,
} from "~/types/socket.types";
import Room from "./classes/Room/Room";
import { roomManager } from "./controllers/RoomManager";
import { roomHandler } from "./handlers/roomHandlers";
import { teamHandler } from "./handlers/teamHandlers";
import { flaggenHandler } from "./handlers/games/flaggenHandlers";
import type { TGame } from "~/components/room/Game/games/game.types";
import { merkenHandler } from "./handlers/games/merkenHandlers";

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
      cors: {
        origin: ["https://admin.socket.io"],
        credentials: true,
      },
    }
  );

  instrument(io, {
    auth: {
      type: "basic",
      username: env.SOCKET_IO_ADMIN_USERNAME,
      password: env.SOCKET_IO_ADMIN_PASSWORD,
    },
    mode: "production",
  });

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

    const tmpRoom = new Room(
      id,
      name,
      isPrivate,
      user,
      modus,
      games as unknown as TGame[]
    );

    roomManager.addRoom(tmpRoom);
  });

  const onConnection = (
    socket: Socket<
      IClientToServerEvents,
      IServerToClientEvents,
      IServerSocketData
    >
  ) => {
    // initialize all handlers
    roomHandler(io, socket);
    teamHandler(io, socket);

    // handler for all games
    flaggenHandler(io, socket);
    merkenHandler(io, socket);
  };

  io.on("connection", onConnection);

  res.end();
}
