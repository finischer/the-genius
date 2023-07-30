import { randomUUID } from "crypto";
import { copyNestedArray } from "~/utils/array";
import { io } from "../../socket";
import Team from "../Team/Team";
import { type IRoom } from "./room.types";
import { roomManager } from "../../controllers/RoomManager";
import {
  TGame,
  type TGameNames,
} from "~/pages/room/_components/Game/games/game.types";
import { type TGameSettingsMap } from "~/hooks/useConfigurator/useConfigurator.types";

const ROOM_DEFAULTS = {
  roomSize: 12,
  currentGame: "",
};

const SECONDS_TO_ROTATE_TITLE_BANNER = 4;
const SECONDS_TOTAL_INTRO_DURATION = 8;
const SECONDS_DELAY_BEFORE_GAME_DISPLAYS = 2;

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
  maxPlayersPerTeam: IRoom["maxPlayersPerTeam"];

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
    this.maxPlayersPerTeam = this.numOfPlayers / 2;
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
        gameIntro: {
          alreadyPlayed: false,
          flippedTitleBanner: false,
          milliseconds: 0,
        },
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

  getGame<T extends TGameNames>(gameIdentifier: T): TGameSettingsMap[T] {
    const game = this.games.find((g) => g.identifier === gameIdentifier) as
      | TGameSettingsMap[T];
    return game;
  }

  startGame(gameIdentifier: TGameNames) {
    this.state.display.gameIntro = {
      alreadyPlayed: false,
      flippedTitleBanner: false,
      milliseconds: 0,
    };

    this.currentGame = gameIdentifier;
    this.state.display.game = false;

    // tbd: stop current music
    // tbd: start intro music
    this.update();

    setTimeout(() => {
      this.state.display.gameIntro.flippedTitleBanner = true;
      this.update();
    }, SECONDS_TO_ROTATE_TITLE_BANNER * 1000);

    setTimeout(() => {
      this.state.display.gameIntro.alreadyPlayed = true;
      this.update();

      setTimeout(() => {
        this.state.display.game = true;
        this.update();
      }, SECONDS_DELAY_BEFORE_GAME_DISPLAYS * 1000);
    }, SECONDS_TOTAL_INTRO_DURATION * 1000);
  }

  startTimer(seconds: number, cb: () => void = () => null) {
    const timer = this.state.display.clock;

    if (timer.isActive) return;

    timer.currentSeconds = seconds;
    timer.isActive = true;

    this.update();

    const interval = setInterval(() => {
      if (!timer.isActive) {
        clearInterval(interval);
        return;
      }

      this.decrementTimer();
      this.update();
      if (timer.currentSeconds === 0) {
        clearInterval(interval);
        cb();
        this.update();

        // let timer disappear after 1 second
        setTimeout(() => {
          this.stopTimer();
          this.update();
        }, 1000);
      }
    }, 1000);
  }

  decrementTimer() {
    this.state.display.clock.currentSeconds--;
  }

  stopTimer() {
    this.state.display.clock.isActive = false;
  }

  releaseBuzzer() {
    Object.values(this.teams).forEach((t) => {
      t.isActiveTurn = false;
      t.buzzer = {
        isPressed: false,
        playerBuzzered: "",
      };
    });
  }

  update() {
    io.to(this.id).emit("updateRoom", { newRoomState: this });

    const allRooms = roomManager.getRoomsAsArray();
    io.emit("updateAllRooms", { newRooms: allRooms });
  }
}
