import { type GameshowMode } from "@prisma/client";
import { type TUserReduced } from "~/types/socket.types";
import { type ITeam } from "../Team/team.types";
import type { TGame } from "~/components/room/Game/games/game.types";

export type TRoomAnswerState = {
  showAnswer: boolean;
  answer: string;
  withSound: boolean;
};

type ClockVariants = "countdown" | "timer";

export type TRoomView = "empty" | "game" | "scoreboard";

export type TRoomClock = {
  isActive: boolean;
  currentSeconds: number;
  to: number;
  variant: ClockVariants;
};

type TRoomDisplayGameIntro = {
  alreadyPlayed: boolean;
  flippedTitleBanner: boolean;
  milliseconds: number;
};

export type TRoomDisplay = {
  confetti: boolean;
  gameIntro: TRoomDisplayGameIntro;
  game: boolean;
  notefields: boolean;
  clock: TRoomClock;
};

export type TRoomSounds = {
  correctAnswer: boolean;
  wrongAnswer: boolean;
  buzzer: boolean;
  winning: boolean;
  intro: boolean;
};

export type TRoomMusic = {
  title: string;
  isActive: false;
};

export type TRoomState = {
  currentView: string;
  answerState: TRoomAnswerState;
  gameshowStarted: boolean;
  teamWithTurn: string;
  display: TRoomDisplay;
  sounds: TRoomSounds;
  music: TRoomMusic;
  view: TRoomView;
};

export interface IRoom {
  id: string;
  name: string;
  modus: GameshowMode;
  roomSize: number;
  currentGame: string;
  createdAt: string; // socket io stringify dates. So we will save it as string and on client site we will create a date, depends on the string
  isPrivateRoom: boolean;
  creator: TUserReduced | null;
  numOfPlayers: number;
  maxPlayersPerTeam: number;
  participants: string[];
  games: TGame[];
  defaultGameStates: unknown[];
  teams: {
    teamOne: ITeam;
    teamTwo: ITeam;
  };
  state: TRoomState;
}
