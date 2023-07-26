import { randomUUID } from "crypto";
import { copyNestedArray } from "~/utils/array";
import { io } from "../../socket";
import Team from "../Team/Team";
import { type IRoom } from "./room.types";
import { roomManager } from "../../controllers/RoomManager";
import { TGameNames } from "~/games/game.types";

const ROOM_DEFAULTS = {
  roomSize: 12,
  currentGame: "",
};

export default class Room implements IRoom {
  id: IRoom["id"];
  name: IRoom["name"];
  isPrivateRoom: IRoom["isPrivateRoom"];
  creator: IRoom["creator"];
  numOfPlayers: IRoom["numOfPlayers"];
  games: IRoom["games"];
  defaultGameStates: IRoom["defaultGameStates"];
  teams: IRoom["teams"];
  state: IRoom["state"];
  participants: IRoom["participants"];
  modus: IRoom["modus"];
  roomSize: IRoom["roomSize"];
  createdAt: IRoom["createdAt"];
  currentGame: IRoom["currentGame"];

  public constructor(
    id: IRoom["id"] | undefined = undefined,
    name: IRoom["name"],
    isPrivateRoom: IRoom["isPrivateRoom"],
    creator: IRoom["creator"],
    modus: IRoom["modus"],
    games: IRoom["games"]
  ) {
    this.id = id !== undefined ? id : randomUUID();
    this.name = name;
    this.modus = modus;
    this.roomSize = ROOM_DEFAULTS.roomSize;
    this.createdAt = new Date();
    this.currentGame = ROOM_DEFAULTS.currentGame;
    this.isPrivateRoom = isPrivateRoom;
    this.creator = creator;
    this.numOfPlayers = modus === "DUELL" ? 2 : 4;
    this.participants = [];
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
    return Object.values(this.teams).find((t) => t.id === teamId);
  }

  startGame(gameIdentifier: TGameNames) {
    this.currentGame = gameIdentifier;
  }

  update() {
    io.to(this.id).emit("updateRoom", { newRoomState: this });

    const allRooms = roomManager.getRoomsAsArray();
    io.emit("updateAllRooms", { newRooms: allRooms });
  }
}
