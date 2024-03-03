import { roomStore } from "~/config/store";

const SECONDS_TO_ROTATE_TITLE_BANNER = 4;
const SECONDS_TOTAL_INTRO_DURATION = 8;
const SECONDS_DELAY_BEFORE_GAME_DISPLAYS = 2;

const NUM_PLAYERS_DUELL = 1; // per Team
const NUM_PLAYERS_TEAM = 2; // per Team

export default class Room {
  id: string;
  name: string;
  //   modus: GameshowMode;
  //   maxPlayersPerTeam: number;
  //   roomSize: number;
  //   participants: string[];
  password: string | null;
  //   isPrivate: boolean;
  //   currentGame: string | null;
  creatorId: string;
  timerSeconds: number;
  //   createdAt: Date;
  //   updatedAt: Date;
  //   games: TGame[];
  //   defaultGameStates: Prisma.JsonValue[];
  //   teams: TRoomTeams;
  //   state: RoomState;

  interval: NodeJS.Timer | undefined;

  public constructor(name: string, password: string, creatorId: string, roomId: string) {
    this.id = roomId;
    this.name = name;
    // this.modus = room.modus;
    // this.roomSize = room.roomSize;
    // this.participants = room.participants;
    this.password = password; // TODO: should not be leaked to the client
    // this.isPrivate = room.isPrivate;
    // this.currentGame = room.currentGame;
    // this.maxPlayersPerTeam = room.maxPlayersPerTeam;
    this.creatorId = creatorId; // TODO: Add only name of creator -> userIds are sensible data which should not be leaked to the client
    this.timerSeconds = 0;
    // this.createdAt = room.createdAt;
    // this.updatedAt = room.updatedAt;
    // this.games = room.games as unknown as TGame[];
    // this.defaultGameStates = room.defaultGameStates;
    // this.teams = {
    //   teamOne: new Team(room.teams.teamOne),
    //   teamTwo: new Team(room.teams.teamTwo),
    // };
    // this.state = room.state;
  }

  startTimer() {
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.interval = setInterval(() => {
      roomStore.room.state.timerSeconds += 1;
    }, 1000);
  }
}
