import { randomUUID } from "crypto";
import { type Server } from "socket.io";
import {
  type IClientToServerEvents,
  type IServerSocketData,
  type IServerToClientEvents,
} from "~/types/socket.types";
import { copyNestedArray } from "~/utils/array";
import { type IRoom } from "./room.types";
import { io } from "../../socket";
import Team from "../Team/Team";

export default class Room implements IRoom {
  id: IRoom["id"];
  name: IRoom["name"];
  isPrivateRoom: IRoom["isPrivateRoom"];
  creator: IRoom["creator"];
  gameshowMode: IRoom["gameshowMode"];
  numOfPlayers: IRoom["numOfPlayers"];
  games: IRoom["games"];
  defaultGameStates: IRoom["defaultGameStates"];
  teams: IRoom["teams"];
  state: IRoom["state"];

  public constructor(
    id: IRoom["id"] | undefined = undefined,
    name: IRoom["name"],
    isPrivateRoom: IRoom["isPrivateRoom"],
    creator: IRoom["creator"],
    numOfPlayers: IRoom["numOfPlayers"],
    gameshowMode: IRoom["gameshowMode"],
    games: IRoom["games"]
  ) {
    this.id = id !== undefined ? id : randomUUID();
    this.name = name;
    this.isPrivateRoom = isPrivateRoom;
    this.creator = creator;
    this.numOfPlayers = numOfPlayers;
    this.gameshowMode = gameshowMode;
    this.games = games;
    this.defaultGameStates = copyNestedArray(games);
    this.teams = {
      teamOne: new Team("Team 1", "teamOne"),
      teamTwo: new Team("Team 2", "teamTwo"),
    };
    // state which changed dynamically
    this.state = {
      answerState: {
        showAnswer: false,
        answer: "",
        withSound: false,
      },
      currentView: "",
      display: {
        clock: {
          isActive: false,
          currentSeconds: 0,
          to: 0,
          variant: "countdown",
        },
        confetti: false,
        game: false,
        gameIntro: false,
        notefields: false,
      },
      gameshowStarted: false,
      music: {
        isActive: false,
        title: "",
      },
      sounds: {
        buzzer: false,
        correctAnswer: false,
        intro: false,
        winning: false,
        wrongAnswer: false,
      },
      teamWithTurn: "",
    };
  }

  isPlayer(playerId: string) {
    for (const [teamIdentifier, team] of Object.entries(this.teams)) {
      const player = team.getPlayer(playerId);
      if (player)
        return {
          teamIdentifier,
          ...player,
        };
    }

    return false;
  }

  getTeamById(teamId: string) {
    console.log(Object.values(this.teams).find((t) => t.id === teamId));

    return Object.values(this.teams).find((t) => t.id === teamId);
  }

  update() {
    io.to(this.id).emit("updateRoom", { newRoomState: this });
  }
}
