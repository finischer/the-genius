import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { type Server, type Socket } from "socket.io";
import { prisma } from "~/server/db";
import {
  type IClientToServerEvents,
  type IServerSocketData,
  type IServerToClientEvents,
} from "~/types/socket.types";
import Room from "../../classes/Room/Room";
import { roomManager } from "../../controllers/RoomManager";
import NoRoomException from "../../exceptions/NoRoomException";
import { getRoomAndTeam } from "../helpers";
import { SCOREBAR_TIMER_SECONDS } from "../../classes/Team/Team";
import { type TGame } from "~/components/room/Game/games/game.types";

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
      gameshow.games as unknown as TGame[]
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

  socket.on("releaseBuzzer", () => {
    const room = roomManager.getRoom(socket.roomId);
    if (!room) return new NoRoomException(socket);

    room.releaseBuzzer();
    room.update();
  });

  socket.on(
    "showAnswerBanner",
    ({ answer, withSound = false, autoClose = false }) => {
      const room = roomManager.getRoom(socket.roomId);
      if (!room) return new NoRoomException(socket);

      room.state.answerState.answer = answer;
      room.state.answerState.showAnswer = true;
      room.update();
    }
  );

  socket.on("hideAnswerBanner", () => {
    const room = roomManager.getRoom(socket.roomId);
    if (!room) return new NoRoomException(socket);

    room.state.answerState.showAnswer = false;
    room.state.answerState.answer = "";
    room.update();
  });

  socket.on("buzzer", ({ teamId, withTimer = false }) => {
    const res = getRoomAndTeam(socket, socket.roomId, teamId);
    if (!res) return;

    const { room, team } = res;

    if (team.buzzer.isPressed || room.state.teamWithTurn) return;

    room.state.teamWithTurn = teamId;
    team.isActiveTurn = true;
    team.buzzer = {
      isPressed: true,
      playerBuzzered: socket.user?.id || "",
    };

    if (withTimer) {
      team.startScorebarTimer();
      room.update();
      const interval = setInterval(() => {
        if (team.scorebarTimer.seconds === 0) {
          clearInterval(interval);
          team.stopScorebarTimer();
          room.update();

          setTimeout(() => {
            team.scorebarTimer.seconds = SCOREBAR_TIMER_SECONDS;
            room.update();
          }, 1000);
          return;
        }

        team.scorebarTimer.seconds--;
        room.update();
      }, 1000);
    }

    room.update();
  });
}
