import { type Socket } from "socket.io";
import {
  type IClientToServerEvents,
  type IServerSocketData,
  type IServerToClientEvents,
} from "~/types/socket.types";
import { roomManager } from "../controllers/RoomManager";
import NoRoomException from "../exceptions/NoRoomException";
import NoTeamException from "../exceptions/NoTeamException";
import type Room from "../classes/Room/Room";
import type Team from "../classes/Team/Team";

type GetRoomAndTeamReturnType =
  | {
      room: Room;
      team: Team;
    }
  | undefined;

export function getRoomAndTeam(
  socket: Socket<IClientToServerEvents, IServerToClientEvents, IServerSocketData> & IServerSocketData,
  roomId: string | null | undefined,
  teamId: string | null | undefined
): GetRoomAndTeamReturnType {
  const room = roomManager.getRoom(roomId);
  if (!room) {
    new NoRoomException(socket);
    return;
  }

  const team = room.getTeamById(teamId);

  if (!team) {
    new NoTeamException(socket);
    return;
  }

  return { room, team };
}
