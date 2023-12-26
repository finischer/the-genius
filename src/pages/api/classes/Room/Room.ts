import type { GameshowMode, Prisma, Room as PrismaRoom, RoomState, RoomViews } from "@prisma/client";
import type { TGame, TGameNames } from "~/components/room/Game/games/game.types";
import { type TGameSettingsMap } from "~/hooks/useConfigurator/useConfigurator.types";
import { io } from "../../socket";
import Team from "../Team/Team";
import { type IRoomMaxPlayersTeamMap, type PrismaRoomFixed, type TRoomTeams } from "./room.types";
import { prisma } from "~/server/db";

const SECONDS_TO_ROTATE_TITLE_BANNER = 4;
const SECONDS_TOTAL_INTRO_DURATION = 8;
const SECONDS_DELAY_BEFORE_GAME_DISPLAYS = 2;

const NUM_PLAYERS_DUELL = 1; // per Team
const NUM_PLAYERS_TEAM = 2; // per Team

export default class Room implements PrismaRoomFixed {
  id: string;
  name: string;
  modus: GameshowMode;
  maxPlayersPerTeam: number;
  roomSize: number;
  participants: string[];
  password: string | null;
  isPrivate: boolean;
  currentGame: string | null;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
  games: TGame[];
  defaultGameStates: Prisma.JsonValue[];
  teams: TRoomTeams;
  state: RoomState;

  public constructor(room: PrismaRoom) {
    this.id = room.id;
    this.name = room.name;
    this.modus = room.modus;
    this.roomSize = room.roomSize;
    this.participants = room.participants;
    this.password = room.password; // TODO: should not be leaked to the client
    this.isPrivate = room.isPrivate;
    this.currentGame = room.currentGame;
    this.maxPlayersPerTeam = room.maxPlayersPerTeam;
    this.creatorId = room.creatorId; // TODO: Add only name of creator -> userIds are sensible data which should not be leaked to the client
    this.createdAt = room.createdAt;
    this.updatedAt = room.updatedAt;
    this.games = room.games as unknown as TGame[];
    this.defaultGameStates = room.defaultGameStates;
    this.teams = {
      teamOne: new Team(room.teams.teamOne),
      teamTwo: new Team(room.teams.teamTwo),
    };
    this.state = room.state;
  }

  static getMaxPlayersPerTeam(modus: GameshowMode) {
    const map: IRoomMaxPlayersTeamMap = {
      DUELL: NUM_PLAYERS_DUELL,
      TEAM: NUM_PLAYERS_TEAM,
    };

    return map[modus];
  }

  static createDefaultRoomState(): RoomState {
    return {
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
          variant: "COUNTDOWN",
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
      view: "EMPTY",
      gameshowStarted: false,
      music: {
        isActive: false,
        title: "",
      },
      sounds: {
        bass: false,
        bell: false,
        buzzer: false,
        winning: false,
        intro: false,
        shimmer: false,
        typewriter: false,
        warningBuzzer: false,
        whoosh_1: false,
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

  getTeamById(teamId: string | undefined | null) {
    if (!teamId) return null;
    return Object.values(this.teams).find((t) => t.id === teamId);
  }

  getGame<T extends TGameNames>(gameIdentifier: T): TGameSettingsMap[T] {
    const games = this.games as unknown as TGame[];
    const game = games.find((g) => g.identifier === gameIdentifier) as unknown as TGameSettingsMap[T];
    return game;
  }

  startGame(gameIdentifier: TGameNames) {
    this.state.display.gameIntro = {
      alreadyPlayed: false,
      flippedTitleBanner: false,
      milliseconds: 0,
    };
    this.state.view = "GAME";

    this.currentGame = gameIdentifier;
    this.state.display.game = false;

    // reset gamescores
    Object.values(this.teams).forEach((team) => team.resetGameScore());

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
    this.state.teamWithTurn = "";
    Object.values(this.teams).forEach((t) => {
      t.isActiveTurn = false;
      t.buzzer = {
        isPressed: false,
        playersBuzzered: [],
      };
    });
  }

  changeView(newView: RoomViews) {
    this.state.view = newView;
  }

  update() {
    // TODO: add safe room schema to prevent leaks of sensible information

    io.to(this.id).emit("updateRoom", { newRoomState: this });

    // update room state in db
    void prisma.room.update({
      where: {
        id: this.id,
      },
      data: {
        teams: this.teams,
        state: this.state,
      },
    });

    // DEPRECATED
    // const allRooms = roomManager.getRoomsAsArray();
    // io.emit("updateAllRooms", { newRooms: allRooms });
  }

  // function which defines which information can be send to the client
  // getFilteredRoom() {}
}
