import { type GameshowMode } from "@prisma/client";
import { type TUserReduced } from "~/types/socket.types";
import { type ITeam } from "../Team/team.types";
import { IGameGeneralState, TGameNames } from "~/games/game.types";
import { TGameSettingsMap } from "~/hooks/useConfigurator/useConfigurator.types";

export type TRoomAnswerState = {
  showAnswer: boolean;
  answer: string;
  withSound: boolean;
};

type ClockVariants = "countdown" | "timer";

export type TRoomClock = {
  isActive: boolean;
  currentSeconds: number;
  to: number;
  variant: ClockVariants;
};

export type TRoomDisplay = {
  confetti: boolean;
  gameIntro: boolean;
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
};

export interface IRoom {
  id: string;
  name: string;
  modus: GameshowMode;
  roomSize: number;
  currentGame: string;
  createdAt: Date;
  isPrivateRoom: boolean;
  creator: TUserReduced | null;
  numOfPlayers: number;
  maxPlayersPerTeam: number;
  participants: string[];
  games: TGameSettingsMap[TGameNames][];
  defaultGameStates: unknown[];
  teams: {
    teamOne: ITeam;
    teamTwo: ITeam;
  };
  state: TRoomState;
}
