import { type Server, type Socket } from "socket.io";
import {
  type IClientToServerEvents,
  type IServerSocketData,
  type IServerToClientEvents,
} from "~/types/socket.types";
import { roomManager } from "../../controllers/RoomManager";
import NoRoomException from "../../exceptions/NoRoomException";
import { Games } from "~/components/room/Game/games/game.types";

const GAME_IDENTIFIER = Games.GEHEIMWOERTER;
const MS_DELAY = 1000;

export function geheimwoerterHandler(
  io: Server,
  socket: Socket<IClientToServerEvents, IServerToClientEvents, IServerSocketData> & IServerSocketData
) {
  socket.on("geheimwoerter:toggleCodeList", () => {
    const room = roomManager.getRoom(socket.roomId);
    if (!room) return new NoRoomException(socket);
    const game = room.getGame(GAME_IDENTIFIER);

    game.display.codeList = !game.display.codeList;

    room.update();
  });

  socket.on("geheimwoerter:toggleWords", () => {
    const room = roomManager.getRoom(socket.roomId);
    if (!room) return new NoRoomException(socket);
    const game = room.getGame(GAME_IDENTIFIER);

    game.display.words = !game.display.words;
    game.display.answer = false;

    room.update();
  });

  socket.on("geheimwoerter:showAnswer", () => {
    const room = roomManager.getRoom(socket.roomId);
    if (!room) return new NoRoomException(socket);
    const game = room.getGame(GAME_IDENTIFIER);

    game.display.answer = true;

    room.update();
  });

  socket.on("geheimwoerter:nextQuestion", () => {
    const room = roomManager.getRoom(socket.roomId);
    if (!room) return new NoRoomException(socket);
    const game = room.getGame(GAME_IDENTIFIER);

    if (game.qIndex >= game.questions.length - 1) return;

    const msDelay = game.display.answer ? MS_DELAY : 0;

    game.display.answer = false;
    game.display.words = false;
    room.update();

    setTimeout(() => {
      game.qIndex++;
      room.update();
    }, msDelay);
  });

  socket.on("geheimwoerter:prevQuestion", () => {
    const room = roomManager.getRoom(socket.roomId);
    if (!room) return new NoRoomException(socket);
    const game = room.getGame(GAME_IDENTIFIER);

    if (game.qIndex <= 0) return;

    const msDelay = game.display.answer ? MS_DELAY : 0;

    game.display.answer = false;
    game.display.words = false;
    room.update();

    setTimeout(() => {
      game.qIndex--;
      room.update();
    }, msDelay);
  });
}
