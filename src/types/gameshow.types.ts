import type { BuzzerState, ScorebarTimerState, TeamAvatarImage } from "@prisma/client";
import type { Game, TGame } from "~/components/room/Game/games/game.types";

export enum RoomView {
  EMPTY = "empty",
  SCOREBOARD = "scoreboard",
  GAME = "game",
}

export enum TimerType {
  COUNTDOWN = "countdown",
  STOPWATCH = "stopwatch",
}

export type Team = {
  id: string;
  name: string;
  totalScore: number;
  gameScore: number;
  avatarImage: string;
  avatarImageList: TeamAvatarImage[];
  players: Player[];
  buzzer: BuzzerState;
  scorebarTimer: ScorebarTimerState;
  isActiveTurn: boolean;
};

export type TimerState = {
  id: NodeJS.Timer | null;
  active: boolean;
  currSeconds: number;
  initSeconds: number;
};

export type Room = {
  id: string;
  creatorId: string;
  name: string;
  password: string;
  teams: {
    teamOne: Team;
    teamTwo: Team;
  };
  games: TGame[];
  context: {
    currentGame: Game | null;
    view: RoomView;
    answerState: RoomAnswerState;
    header: {
      timer: TimerState;
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
  value: "";
};

export type RoomAnswerState = {
  isAnswerDisplayed: boolean;
  answer: string;
};
