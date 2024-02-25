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
import { flaggenHandler } from "./handlers/games/flaggenHandlers";
import { merkenHandler } from "./handlers/games/merkenHandlers";
import { roomHandler } from "./handlers/roomHandlers";
import { teamHandler } from "./handlers/teamHandlers";
import { geheimwoerterHandler } from "./handlers/games/geheimwoerterHandlers";
import { setHandler } from "./handlers/games/setHandlers";
import { duSagstHandler } from "./handlers/games/duSagstHandlers";
import { musicHandler } from "./handlers/musicHandlers";
import { MongoClient } from "mongodb";
import { SOCKET_IO_ADAPTER } from "~/config/database";
import { createAdapter } from "@socket.io/mongo-adapter";
const prisma = new PrismaClient();

export let io: Server<IClientToServerEvents, IServerToClientEvents, IServerSocketData>;

const setupMongoAdapter = async () => {
  const mongoClient = new MongoClient(env.MONGODB_URI);

  await mongoClient.connect();

  const collection = SOCKET_IO_ADAPTER.mongodb.collection;

  try {
    await mongoClient.db().createCollection(collection, {
      capped: true,
      size: 1e6,
    });
  } catch {
    console.log(`Collection already exists: ${collection}`);
  }

  const mongoCollection = mongoClient.db().collection(collection);

  return createAdapter(mongoCollection);
};

export default async function SocketHandler(req: NextApiRequest, res: TNextApiResponse) {
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
      transports: ["websocket", "polling"],
      cors: {
        origin: "*",
        credentials: true,
        methods: ["GET", "POST"],
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

  rooms.forEach((room) => {
    const newRoom = new Room(room);
    roomManager.addRoom(newRoom);
  });

  const onConnection = (socket: Socket<IClientToServerEvents, IServerToClientEvents, IServerSocketData>) => {
    // initialize all handlers
    roomHandler(io, socket);
    teamHandler(io, socket);

    // music and sound effects
    musicHandler(io, socket);

    // handler for all games
    flaggenHandler(io, socket);
    merkenHandler(io, socket);
    geheimwoerterHandler(io, socket);
    setHandler(io, socket);
    duSagstHandler(io, socket);
  };

  // set up mongodb adapter
  const mongoAdapter = await setupMongoAdapter();

  io.adapter(mongoAdapter);
  io.on("connection", onConnection);

  res.end();
}
