import { type Server, type Socket } from "socket.io";
import {
  type IClientToServerEvents,
  type IServerSocketData,
  type IServerToClientEvents,
} from "~/types/socket.types";
import { getRoomAndTeam } from "../helpers";
import { roomManager } from "../../controllers/RoomManager";
import NoRoomException from "../../exceptions/NoRoomException";

export function musicHandler(
  io: Server,
  socket: Socket<IClientToServerEvents, IServerToClientEvents, IServerSocketData> & IServerSocketData
) {
  socket.on("playMusic", ({ songId }) => {
    const room = roomManager.getRoom(socket.roomId);

    if (!room) return new NoRoomException(socket);

    room.state.music = {
      isActive: true,
      title: songId,
    };

    room.update();
  });

  socket.on("pauseMusic", () => {
    const room = roomManager.getRoom(socket.roomId);

    if (!room) return new NoRoomException(socket);

    room.state.music.isActive = false;
    room.update();
  });

  socket.on("playSound", ({ soundId }) => {
    const room = roomManager.getRoom(socket.roomId);

    if (!room) return new NoRoomException(socket);

    room.state.sounds[soundId] = true;
    room.update();

    setTimeout(() => {
      room.state.sounds[soundId] = false;
      room.update();
    }, 500);
  });

  socket.on("stopSound", ({ soundId }) => {
    const room = roomManager.getRoom(socket.roomId);

    if (!room) return new NoRoomException(socket);

    room.state.sounds[soundId] = false;
    room.update();
  });
}
