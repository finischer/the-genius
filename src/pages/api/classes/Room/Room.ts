import { GameshowMode } from "@prisma/client";
import { randomUUID } from "crypto";
import { copyNestedArray } from "~/utils/array";
import { IRoom, TRoomState } from "./room.types";
import Team from "../Team/Team";

export default class Room implements IRoom {
  id: IRoom["id"];
  name: IRoom["name"];
  isPrivateRoom: IRoom["isPrivateRoom"];
  createdById: IRoom["createdById"];
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
    createdById: IRoom["createdById"],
    numOfPlayers: IRoom["numOfPlayers"],
    gameshowMode: IRoom["gameshowMode"],
    games: IRoom["games"]
  ) {
    this.id = id !== undefined ? id : randomUUID();
    this.name = name;
    this.isPrivateRoom = isPrivateRoom;
    this.createdById = createdById;
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
}
