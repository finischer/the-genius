import { type Server, type Socket } from "socket.io";
import {
  type IClientToServerEvents,
  type IServerSocketData,
  type IServerToClientEvents,
} from "~/types/socket.types";
import { roomManager } from "../../controllers/RoomManager";
import NoRoomException from "../../exceptions/NoRoomException";
import { Game } from "~/components/room/Game/games/game.types";

const GAME_IDENTIFIER = Game.MERKEN;

export function merkenHandler(
  io: Server,
  socket: Socket<IClientToServerEvents, IServerToClientEvents, IServerSocketData> & IServerSocketData
) {
  socket.on("merken:startGame", () => {
    const room = roomManager.getRoom(socket.roomId);
    if (!room) return new NoRoomException(socket);

    const game = room.getGame(GAME_IDENTIFIER);

    game.allCardsFlipped = true;
    room.update();

    room.startTimer(game.timerState.timeToThinkSeconds, () => {
      game.allCardsFlipped = false;
    });
  });

  socket.on("merken:flipCard", ({ cardIndex }) => {
    const room = roomManager.getRoom(socket.roomId);
    if (!room) return new NoRoomException(socket);

    const game = room.getGame(GAME_IDENTIFIER);

    if (game.openCards.includes(cardIndex)) {
      const newOpenCards = game.openCards.filter((card) => card !== cardIndex);
      game.openCards = newOpenCards;
    } else {
      game.openCards.push(cardIndex);
    }

    room.update();
  });
}
