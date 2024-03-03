import type { BuzzerState, ScorebarTimerState, TeamAvatarImage } from "@prisma/client";

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
  name: string;
  password: string;
  teams: {
    teamOne: Team;
    teamTwo: Team;
  };
  counter: number;
  intervalId: NodeJS.Timer | null;
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
