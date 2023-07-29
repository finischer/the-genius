import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { type Socket, type Server } from "socket.io";
import { prisma } from "~/server/db";
import {
  type IClientToServerEvents,
  type IServerToClientEvents,
  type IServerSocketData,
} from "~/types/socket.types";
import Room from "../../classes/Room/Room";
import { roomManager } from "../../controllers/RoomManager";
import NoRoomException from "../../exceptions/NoRoomException";
import { TGameSettingsMap } from "~/hooks/useConfigurator/useConfigurator.types";
import { TGameNames } from "~/games/game.types";

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
  socket.on("listAllRooms", (cb) => {
    const rooms = roomManager.getRoomsAsArray();
    cb(rooms);
  });

  socket.on("createRoom", async ({ user, roomConfig, gameshow }, cb) => {
    const { name, modus, isPrivateRoom, password, games } = roomConfig;

    const roomId = new ObjectId().toString();
    const room = new Room(
      roomId,
      name,
      isPrivateRoom,
      user,
      modus,
      gameshow.games as TGameSettingsMap[TGameNames][]
    );

    // push room to room manager
    roomManager.addRoom(room);
    // push room to database
    const dbRoom = await prisma.room.create({
      data: {
        id: roomId,
        name: name,
        modus: modus,
        creatorId: user.id,
        isPrivate: isPrivateRoom,
        password: await bcrypt.hash(password, 10),
        roomSize: room.roomSize,
        // @ts-ignore
        teams: room.teams,
        // @ts-ignore
        games: room.games,
        // @ts-ignore
        defaultGameStates: room.defaultGameStates,
      },
    });

    if (!dbRoom) {
      // TODO: send error that room could not be created -> at least not created to database
    }

    cb(room);
    const allRooms = roomManager.getRoomsAsArray();
    io.emit("updateAllRooms", { newRooms: allRooms });
  });

  socket.on("closeRoom", async ({ roomId }, cb) => {
    const room = roomManager.getRoom(roomId);

    if (!room) return new NoRoomException(socket);

    let deleteSuccessful = roomManager.removeRoom(roomId);

    if (deleteSuccessful) {
      // Remove also in database
      const dbRoom = await prisma.room.delete({
        where: {
          id: roomId,
        },
      });

      if (!dbRoom) {
        deleteSuccessful = false;
      }
    }
    if (deleteSuccessful) {
      socket.to(roomId).emit("roomWasClosed");
      const allRooms = roomManager.getRoomsAsArray();
      io.emit("updateAllRooms", { newRooms: allRooms });
    }

    if (cb) cb({ closeSuccessful: deleteSuccessful });
  });

  socket.on("joinRoom", async ({ user, roomId }, cb) => {
    const room = roomManager.getRoom(roomId);

    if (!room) return new NoRoomException(socket);

    socket.user = {
      id: user.id,
      name: user.username,
    };
    socket.roomId = roomId;
    await socket.join(roomId);

    room.participants = [...room.participants, socket.user.name];
    room.update();

    cb(room);
  });

  socket.on("leaveRoom", async ({ roomId }) => {
    if (socket.roomId === roomId) {
      const room = roomManager.getRoom(roomId);

      if (!room) return new NoRoomException(socket);

      room.participants = room.participants.filter(
        (p) => p !== socket.user?.name
      );
      room.update();

      socket.to(roomId).emit("userLeftRoom", { user: socket.user || null });
      await socket.leave(roomId);
      socket.roomId = null;
    }
  });

  socket.on("startGame", ({ gameIdentifier }) => {
    const room = roomManager.getRoom(socket.roomId);

    if (!room) return new NoRoomException(socket);

    room.startGame(gameIdentifier);
    room.update();
  });
}