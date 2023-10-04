import { type Server, type Socket } from "socket.io";
import type {
  IDuSagstState,
  TDuSagstAnswerBoxState,
} from "~/components/room/Game/games/DuSagst/duSagst.types";
import {
  type IClientToServerEvents,
  type IServerSocketData,
  type IServerToClientEvents,
} from "~/types/socket.types";
import { roomManager } from "../../controllers/RoomManager";
import NoRoomException from "../../exceptions/NoRoomException";
import { getRoomAndTeam } from "../helpers";
import type { TDuSagstGameState } from "~/components/room/Game/games/DuSagst/config";

const GAME_IDENTIFIER = "duSagst";

function getAllBoxes(game: TDuSagstGameState): TDuSagstAnswerBoxState[] {
  return Object.values(game.teamStates).flatMap((i) => i.boxStates);
}

function getBoxStateById(game: TDuSagstGameState, boxId: string): TDuSagstAnswerBoxState | undefined {
  return getAllBoxes(game).find((box) => box.id === boxId);
}

export function duSagstHandler(
  io: Server,
  socket: Socket<IClientToServerEvents, IServerToClientEvents, IServerSocketData> & IServerSocketData
) {
  socket.on("duSagst:showAnswer", (answerIndex: number) => {
    const room = roomManager.getRoom(socket.roomId);
    if (!room) return new NoRoomException(socket);

    const game = room.getGame(GAME_IDENTIFIER);

    game.display.answers.push(answerIndex);
    room.update();
  });

  // Answer of player
  socket.on("duSagst:showAnswerBox", ({ boxId }) => {
    const room = roomManager.getRoom(socket.roomId);
    if (!room) return new NoRoomException(socket);

    const game = room.getGame(GAME_IDENTIFIER);

    const boxStates = getAllBoxes(game);

    const box = boxStates.find((box) => box.id === boxId);

    if (!box) return;

    box.showAnswer = true;

    room.update();
  });

  socket.on("duSagst:submitAnswers", () => {
    const room = roomManager.getRoom(socket.roomId);
    if (!room) return new NoRoomException(socket);

    const game = room.getGame(GAME_IDENTIFIER);

    getAllBoxes(game).forEach((box) => (box.submitted = true));

    room.update();
  });

  socket.on("duSagst:clickAnswer", ({ answerIndex }) => {
    const res = getRoomAndTeam(socket, socket.roomId, socket.teamId);
    if (!res) return;

    const { room, team } = res;

    const p = team.getPlayer(socket.playerId);
    console.log(p);

    if (!p) return;
    p.shared.duSagst.answer = answerIndex;

    room.update();
  });

  socket.on("duSagst:startTimer", (timerSeconds, cb) => {
    const room = roomManager.getRoom(socket.roomId);
    if (!room) return new NoRoomException(socket);

    const game = room.getGame(GAME_IDENTIFIER);

    getAllBoxes(game).forEach((box) => (box.submitted = false));

    room.startTimer(timerSeconds, cb);
  });
}
