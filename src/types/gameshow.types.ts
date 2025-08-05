import type {
  BuzzerState,
  RoomMusic,
  RoomSounds,
  TeamAvatarImage
} from "@prisma/client";
import type { GameState } from "~/games";

export enum RoomView {
  EMPTY = "empty",
  SCOREBOARD = "scoreboard",
  GAME = "game"
}

export enum TimerType {
  COUNTDOWN = "countdown",
  STOPWATCH = "stopwatch"
}

export type TeamShortNames = "t1" | "t2";

export type Team = {
  id: string;
  name: string;
  shortName: TeamShortNames;
  totalScore: number;
  gameScore: number;
  avatarImage: string;
  avatarImageList: TeamAvatarImage[];
  players: Player[];
  buzzer: BuzzerState;
  scorebarTimer: TimerState;
  isActiveTurn: boolean;
};

export type TimerState = {
  id: NodeJS.Timeout | null;
  active: boolean;
  currSeconds: number;
  initSeconds: number;
};

export type RoomTeams = {
  teamOne: Team;
  teamTwo: Team;
};

export type Room = {
  id: string;
  creatorId: string;
  name: string;
  password: string;
  teams: RoomTeams;
  games: GameState[];
  context: {
    isClosed: boolean;
    currentGame: GameState | null;
    view: RoomView;
    answerState: RoomAnswerState;
    header: {
      timer: TimerState;
    };
    audio: {
      sounds: RoomSounds;
      music: RoomMusic;
    };
    gameIntro: {
      alreadyPlayed: boolean;
      flippedTitleBanner: boolean;
      milliseconds: number;
    };
    display: {
      gameIntro: boolean;
      confetti: boolean;
      roomTimer: boolean;
      game: boolean;
    };
  };
};

export type Player = {
  id: string;
  name: string;
  userId: string;
  teamId: string;
  context: {
    notefield: NoteFieldState;
    duSagst: {
      answer: number;
    };
  };
};

export type NoteFieldState = {
  isActive: boolean;
  value: string;
};

export type RoomAnswerState = {
  isAnswerDisplayed: boolean;
  answer: string;
};
