import type { RoomTeams } from "@prisma/client";
import bcrypt from "bcrypt";
import { type Server, type Socket } from "socket.io";
import { prisma } from "~/server/db";
import {
  type IClientToServerEvents,
  type IServerSocketData,
  type IServerToClientEvents,
} from "~/types/socket.types";
import Room from "../../classes/Room/Room";
import Team, { SCOREBAR_TIMER_SECONDS } from "../../classes/Team/Team";
import { roomManager } from "../../controllers/RoomManager";
import NoRoomException from "../../exceptions/NoRoomException";
import { getRoomAndTeam } from "../helpers";

const DISCONNECTING_TIMEOUT_MS = 5000;

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
    const { name, modus, isPrivate, password } = roomConfig;

    const teams: RoomTeams = {
      teamOne: Team.createTeam("Team 1"),
      teamTwo: Team.createTeam("Team 2"),
    };

    // push room to database to make rooms available for users that are not in the room
    const dbRoom = await prisma.room.create({
      include: {
        creator: {
          select: {
            name: true,
          },
        },
      },
      data: {
        name,
        modus,
        isPrivate,
        teams,
        games: gameshow.games,
        password: await bcrypt.hash(password, 10),
        creator: {
          connect: {
            id: user.id,
          },
        },
        maxPlayersPerTeam: Room.getMaxPlayersPerTeam(modus),
        state: Room.createDefaultRoomState(),
      },
    });

    // create room for gameshow
    const room = new Room(dbRoom);
    // push room to room manager
    roomManager.addRoom(room);
    cb(room);
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
      // const allRooms = roomManager.getRoomsAsArray();
      // io.emit("updateAllRooms", { newRooms: allRooms });
    }

    if (cb) cb({ closeSuccessful: deleteSuccessful });
  });

  socket.on("joinRoom", async ({ user, roomId }, cb) => {
    const room = roomManager.getRoom(roomId);
    if (!room) return new NoRoomException(socket);

    socket.user = {
      id: user.id,
      name: user.username ?? "",
    };
    socket.roomId = roomId;
    await socket.join(roomId);

    room.participants = [...room.participants, socket.user.name];
    room.update();

    console.log(`user ${user.id} joined Room: ${room.id}`);
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

      if (socket.teamId && socket.user) {
        const team = room.getTeamById(socket.teamId);
        if (team) {
          team.removePlayer(socket.user?.id);
          room.update();
        }
      }

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

  socket.on("changeView", ({ newView }) => {
    const room = roomManager.getRoom(socket.roomId);

    if (!room) return new NoRoomException(socket);

    room.changeView(newView);
    room.update();
  });

  socket.on("updateNotefield", ({ playerId, teamId, newValue }) => {
    const res = getRoomAndTeam(socket, socket.roomId, teamId);
    if (!res) return;

    const { room, team } = res;

    const player = team.getPlayer(playerId);

    if (!player) return;

    player.states.notefield.value = newValue;
    room.update();
  });

  socket.on("toggleNotefields", () => {
    const room = roomManager.getRoom(socket.roomId);
    if (!room) return new NoRoomException(socket);

    const allPlayers = Object.values(room.teams)
      .map((t) => t.players)
      .flat();
    allPlayers.forEach(
      (p) => (p.states.notefield.isActive = !p.states.notefield.isActive)
    );
    room.update();
  });

  socket.on("releaseBuzzer", () => {
    const room = roomManager.getRoom(socket.roomId);
    if (!room) return new NoRoomException(socket);

    room.releaseBuzzer();
    room.update();
  });

  socket.on("showAnswerBanner", ({ answer }) => {
    const room = roomManager.getRoom(socket.roomId);
    if (!room) return new NoRoomException(socket);

    room.state.answerState.answer = answer;
    room.state.answerState.showAnswer = true;
    room.update();
  });

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
      playersBuzzered: [...team.buzzer.playersBuzzered, socket.user?.id || ""],
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

  socket.on("disconnecting", (reason) => {
    const room = roomManager.getRoom(socket.roomId);
    if (!room) return new NoRoomException(socket);

    const timeout = setTimeout(async () => {
      // clearTimeout(timeout);
      const allSockets = (await io
        .in(room.id)
        .fetchSockets()) as unknown as IServerSocketData[];

      const isClientReconnected = allSockets.find(
        (s) => s.user?.id === socket.user?.id
      )
        ? true
        : false;

      if (isClientReconnected) return;

      if (socket.roomId) {
        if (socket.teamId) {
          const room = roomManager.getRoom(socket.roomId);
          if (!room) return new NoRoomException(socket);

          const team = room.getTeamById(socket.teamId);

          if (team && socket.user?.id) {
            team.removePlayer(socket.user.id);
            room.update();
          }

          socket.to(socket.roomId).emit("userLeftRoom", { user: socket.user });
          void socket.leave(socket.roomId);
          socket.disconnect(true);
          socket.roomId = null;
        }
      }
    }, DISCONNECTING_TIMEOUT_MS);
  });
}
