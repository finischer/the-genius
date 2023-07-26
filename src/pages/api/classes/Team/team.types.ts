import { type TUserReduced } from "~/types/socket.types";
import { type IPlayer } from "../Player/player.types";

export type TBuzzer = {
  isPressed: boolean;
  playerBuzzered: string; // id of player
};

export type TScorebarTimer = {
  isActive: boolean;
  seconds: number;
};

export interface ITeam {
  id: string;
  name: string;
  identifierKey: string;
  totalScore: number;
  gameScore: number;
  avatarImage: string;
  players: IPlayer[];
  buzzer: TBuzzer;
  scorebarTimer: TScorebarTimer;
  isActiveTurn: boolean;
  getPlayer: (playerId: string) => IPlayer | null;
  join: (user: TUserReduced) => void;
  increaseGameScore: (step: number) => void;
  decreaseGameScore: (step: number) => void;
  resetGameScore: () => void;
  increaseTotalScore: (step: number) => void;
  decreaseTotalScore: (step: number) => void;
  resetTotalScore: () => void;
}
