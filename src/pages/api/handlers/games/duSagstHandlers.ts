import { type Server, type Socket } from "socket.io";
import {
  type IClientToServerEvents,
  type IServerSocketData,
  type IServerToClientEvents,
} from "~/types/socket.types";
import { roomManager } from "../../controllers/RoomManager";
import NoRoomException from "../../exceptions/NoRoomException";
import { getRoomAndTeam } from "../helpers";

const GAME_IDENTIFIER = "duSagst";

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

    for (const teamValue of Object.values(game.teamStates)) {
      for (const playerValue of Object.values(teamValue)) {
        playerValue.submitted = true;
      }
    }
    room.update();
  });

  socket.on("duSagst:clickAnswer", ({ teamId }) => {
    const res = getRoomAndTeam(socket, socket.roomId, teamId);
    if (!res) return;

    const { room, team } = res;
  });
}
