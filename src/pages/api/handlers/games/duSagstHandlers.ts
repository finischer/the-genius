import { type Server, type Socket } from "socket.io";
import type { IDuSagstState } from "~/components/room/Game/games/DuSagst/duSagst.types";
import {
  type IClientToServerEvents,
  type IServerSocketData,
  type IServerToClientEvents,
} from "~/types/socket.types";
import { roomManager } from "../../controllers/RoomManager";
import NoRoomException from "../../exceptions/NoRoomException";
import { getRoomAndTeam } from "../helpers";

const GAME_IDENTIFIER = "duSagst";

function setSubmitState(teamStates: IDuSagstState["teamStates"], newValue: boolean) {
  for (const teamValue of Object.values(teamStates)) {
    for (const playerValue of Object.values(teamValue)) {
      playerValue.submitted = newValue;
    }
  }
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

  socket.on("duSagst:submitAnswers", () => {
    const room = roomManager.getRoom(socket.roomId);
    if (!room) return new NoRoomException(socket);

    const game = room.getGame(GAME_IDENTIFIER);

    setSubmitState(game.teamStates, true);

    room.update();
  });

  socket.on("duSagst:clickAnswer", ({ answerIndex }) => {
    const res = getRoomAndTeam(socket, socket.roomId, socket.teamId);
    if (!res) return;

    const { room, team } = res;

    const p = team.getPlayer(socket.playerId);

    if (!p) return;
    p.shared.duSagst.answer = answerIndex;

    room.update();
  });

  socket.on("duSagst:startTimer", (timerSeconds, cb) => {
    const room = roomManager.getRoom(socket.roomId);
    if (!room) return new NoRoomException(socket);

    const game = room.getGame(GAME_IDENTIFIER);

    setSubmitState(game.teamStates, false);

    room.startTimer(timerSeconds, cb);
  });
}
