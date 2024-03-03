import { type Server, type Socket } from "socket.io";
import {
  type IClientToServerEvents,
  type IServerSocketData,
  type IServerToClientEvents,
} from "~/types/socket.types";
import { roomManager } from "../../controllers/RoomManager";
import NoRoomException from "../../exceptions/NoRoomException";
import { Game } from "~/components/room/Game/games/game.types";

const GAME_IDENTIFIER = Game.FLAGGEN;
const MS_DELAY = 1000;

export function flaggenHandler(
  io: Server,
  socket: Socket<IClientToServerEvents, IServerToClientEvents, IServerSocketData> & IServerSocketData
) {
  socket.on("flaggen:showFlag", () => {
    const room = roomManager.getRoom(socket.roomId);
    if (!room) return new NoRoomException(socket);

    const game = room.getGame(GAME_IDENTIFIER);

    game.display.country = true;
    room.releaseBuzzer();
    room.update();
  });

  socket.on("flaggen:nextFlag", () => {
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

  socket.on("flaggen:prevFlag", () => {
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

  socket.on("flaggen:showAnswer", () => {
    const room = roomManager.getRoom(socket.roomId);
    if (!room) return new NoRoomException(socket);
    const game = room.getGame(GAME_IDENTIFIER);

    game.display.answer = true;
    room.update();
  });
}
