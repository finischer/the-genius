import { Socket } from "socket.io";
import {
  IClientToServerEvents,
  IServerSocketData,
  IServerToClientEvents,
} from "~/types/socket.types";
import { roomManager } from "../controllers/RoomManager";
import NoRoomException from "../exceptions/NoRoomException";
import NoTeamException from "../exceptions/NoTeamException";
import type Room from "../classes/Room/Room";
import { type ITeam } from "../classes/Team/team.types";

type GetRoomAndTeamReturnType =
  | {
      room: Room;
      team: ITeam;
    }
  | undefined;

export function getRoomAndTeam(
  socket: Socket<
    IClientToServerEvents,
    IServerToClientEvents,
    IServerSocketData
  > &
    IServerSocketData,
  roomId: string | null | undefined,
  teamId: string
): GetRoomAndTeamReturnType {
  const room = roomManager.getRoom(socket.roomId);
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
