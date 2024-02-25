import { type Server, type Socket } from "socket.io";
import {
  type IClientToServerEvents,
  type IServerSocketData,
  type IServerToClientEvents,
} from "~/types/socket.types";
import { roomManager } from "../../controllers/RoomManager";
import NoRoomException from "../../exceptions/NoRoomException";
import { Games } from "~/components/room/Game/games/game.types";

const GAME_IDENTIFIER = Games.SET;

export function setHandler(
  io: Server,
  socket: Socket<IClientToServerEvents, IServerToClientEvents, IServerSocketData> & IServerSocketData
) {
  socket.on("set:showCards", () => {
    const room = roomManager.getRoom(socket.roomId);
    if (!room) return new NoRoomException(socket);

    const game = room.getGame(GAME_IDENTIFIER);

    game.display.cards = true;
    room.update();
  });

  socket.on("set:showMarkedCards", () => {
    const room = roomManager.getRoom(socket.roomId);
    if (!room) return new NoRoomException(socket);

    const game = room.getGame(GAME_IDENTIFIER);

    game.display.markedCards = true;
    room.update();
  });

  socket.on("set:flipAllCards", () => {
    const room = roomManager.getRoom(socket.roomId);
    if (!room) return new NoRoomException(socket);

    const game = room.getGame(GAME_IDENTIFIER);

    const currQuestion = game.questions[game.qIndex];

    if (!currQuestion) return;

    if (game.openedCards.length > 0) {
      game.openedCards = [];
    } else {
      game.openedCards = currQuestion.cards.map((_, idx) => idx);
    }

    game.markedCards = [];
    game.markedCardsState = "marked";
    game.display.markedCards = false;
    room.update();
  });

  socket.on("set:toggleCard", (cardIndex) => {
    const room = roomManager.getRoom(socket.roomId);
    if (!room) return new NoRoomException(socket);

    const game = room.getGame(GAME_IDENTIFIER);

    if (game.markedCards.includes(cardIndex)) {
      game.markedCards = game.markedCards.filter((card) => card !== cardIndex);
    } else {
      game.markedCards.push(cardIndex);
    }

    room.update();
  });

  socket.on("set:showMarkedCards", () => {
    const room = roomManager.getRoom(socket.roomId);
    if (!room) return new NoRoomException(socket);

    const game = room.getGame(GAME_IDENTIFIER);

    game.display.markedCards = true;
    game.markedCardsState = "marked";
    room.update();
  });

  socket.on("set:changeMarkerState", (possibleSets) => {
    const room = roomManager.getRoom(socket.roomId);
    if (!room) return new NoRoomException(socket);

    const game = room.getGame(GAME_IDENTIFIER);

    const isContained = possibleSets.some((set) => {
      // Überprüfe, ob jedes Element in "cards" im aktuellen "set" vorhanden ist
      return game.markedCards.every((card) => set.includes(card));
    });

    if (isContained) {
      game.markedCardsState = "correct";
    } else {
      game.markedCardsState = "wrong";
    }

    room.update();
  });

  socket.on("set:nextQuestion", () => {
    const room = roomManager.getRoom(socket.roomId);
    if (!room) return new NoRoomException(socket);

    const game = room.getGame(GAME_IDENTIFIER);

    if (game.qIndex >= game.questions.length - 1) return;

    game.markedCards = [];
    game.openedCards = [];
    game.markedCardsState = "marked";
    game.display.markedCards = false;
    room.update();

    setTimeout(() => {
      game.qIndex++;
      const currQuestion = game.questions[game.qIndex];

      if (!currQuestion) return;

      if (game.openedCards.length > 0) {
        game.openedCards = [];
      } else {
        game.openedCards = currQuestion.cards.map((_, index) => index);
      }
      room.releaseBuzzer();
      room.update();
    }, 500);
  });

  socket.on("set:prevQuestion", () => {
    const room = roomManager.getRoom(socket.roomId);
    if (!room) return new NoRoomException(socket);
    const game = room.getGame(GAME_IDENTIFIER);

    if (game.qIndex <= 0) return;

    game.markedCards = [];
    game.openedCards = [];
    game.markedCardsState = "marked";
    game.display.markedCards = false;
    room.update();

    setTimeout(() => {
      game.qIndex--;
      const currQuestion = game.questions[game.qIndex];

      if (!currQuestion) return;

      if (game.openedCards.length > 0) {
        game.openedCards = [];
      } else {
        game.openedCards = currQuestion.cards.map((_, index) => index);
      }
      room.releaseBuzzer();
      room.update();
    }, 500);
  });
}
