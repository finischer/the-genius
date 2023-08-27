import { type Server, type Socket } from "socket.io";
import {
  type IClientToServerEvents,
  type IServerSocketData,
  type IServerToClientEvents,
} from "~/types/socket.types";
import { getRoomAndTeam } from "../helpers";

export function teamHandler(
  io: Server,
  socket: Socket<
    IClientToServerEvents,
    IServerToClientEvents,
    IServerSocketData
  > &
    IServerSocketData
) {
  socket.on("joinTeam", ({ user, teamId }, cb) => {
    const res = getRoomAndTeam(socket, socket.roomId, teamId);
    if (!res) return;

    const { room, team } = res;

    team.join(user);

    socket.teamId = teamId;
    room.update();
    cb();
  });

  socket.on("increaseGameScore", ({ teamId, step }) => {
    const res = getRoomAndTeam(socket, socket.roomId, teamId);
    if (!res) return;

    const { room, team } = res;

    team.increaseGameScore(step);
    room.update();
  });

  socket.on("decreaseGameScore", ({ teamId, step }) => {
    const res = getRoomAndTeam(socket, socket.roomId, teamId);
    if (!res) return;

    const { room, team } = res;

    team.decreaseGameScore(step);
    room.update();
  });

  socket.on("increaseTotalScore", ({ teamId, step }) => {
    const res = getRoomAndTeam(socket, socket.roomId, teamId);
    if (!res) return;

    const { room, team } = res;

    team.increaseTotalScore(step);
    room.update();
  });

  socket.on("decreaseTotalScore", ({ teamId, step }) => {
    const res = getRoomAndTeam(socket, socket.roomId, teamId);
    if (!res) return;

    const { room, team } = res;

    team.decreaseTotalScore(step);
    room.update();
  });

  socket.on("toggleTeamActive", ({ teamId }) => {
    const res = getRoomAndTeam(socket, socket.roomId, teamId);
    if (!res) return;

    const { room, team } = res;

    team.isActiveTurn = !team.isActiveTurn;
    team.buzzer = {
      isPressed: false,
      playersBuzzered: [],
    };
    room.state.teamWithTurn = "";

    // set other teams active state to false
    const otherTeams = Object.values(room.teams).filter((t) => t.id !== teamId);
    otherTeams.forEach((t) => {
      t.isActiveTurn = false;
    });

    room.update();
  });
}
