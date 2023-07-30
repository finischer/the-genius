import { type Server, type Socket } from "socket.io";
import {
  type IClientToServerEvents,
  type IServerSocketData,
  type IServerToClientEvents,
} from "~/types/socket.types";
import { roomManager } from "../../controllers/RoomManager";
import NoRoomException from "../../exceptions/NoRoomException";

const GAME_IDENTIFIER = "flaggen";
const MS_DELAY = 1000;

export function flaggenHandler(
  io: Server,
  socket: Socket<
    IClientToServerEvents,
    IServerToClientEvents,
    IServerSocketData
  > &
    IServerSocketData
) {
  socket.on("showFlag", () => {
    const room = roomManager.getRoom(socket.roomId);
    if (!room) return new NoRoomException(socket);

    const game = room.getGame(GAME_IDENTIFIER);

    game.display.country = true;
    room.releaseBuzzer();
    room.update();
  });

  socket.on("nextFlag", () => {
    const room = roomManager.getRoom(socket.roomId);
    if (!room) return new NoRoomException(socket);
    const game = room.getGame(GAME_IDENTIFIER);

    if (game.qIndex >= game.countries.length - 1) return;

    const msDelay = game.display.country ? MS_DELAY : 0; // increase qIndex with delay in case flag need to be disappear first

    game.display.country = false;
    game.display.answer = false;
    room.update();

    setTimeout(() => {
      game.qIndex++;
      room.update();
    }, msDelay);
  });

  socket.on("prevFlag", () => {
    const room = roomManager.getRoom(socket.roomId);
    if (!room) return new NoRoomException(socket);
    const game = room.getGame(GAME_IDENTIFIER);

    if (game.qIndex <= 0) return;

    const msDelay = game.display.country ? MS_DELAY : 0; // increase qIndex with delay in case flag need to be disappear first

    game.display.country = false;
    game.display.answer = false;
    room.update();

    setTimeout(() => {
      game.qIndex--;
      room.update();
    }, msDelay);
  });

  socket.on("showAnswer", () => {
    const room = roomManager.getRoom(socket.roomId);
    if (!room) return new NoRoomException(socket);
    const game = room.getGame(GAME_IDENTIFIER);

    // TODO: Add handler to show answer in room -> write function in class Room who handles the answer banner

    game.display.answer = true;
    room.update();
  });
}
