import type { BuzzerState, ScorebarTimerState, TeamAvatarImage } from "@prisma/client";
import type { TGame } from "~/components/room/Game/games/game.types";

export enum RoomView {
  EMPTY = "empty",
  SCOREBOARD = "scoreboard",
  GAME = "game",
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

export type Room = {
  id: string;
  creatorId: string;
  name: string;
  password: string;
  teams: {
    teamOne: Team;
    teamTwo: Team;
  };
  context: {
    view: RoomView;
    answerState: RoomAnswerState;
    display: {
      confetti: boolean;
      roomTimer: boolean;
    };
  };
  games: TGame[];
};

export type Player = {
  id: string;
  name: string;
  userId: string;
  teamId: string;
  context: {
    notefield: NoteFieldState;
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
