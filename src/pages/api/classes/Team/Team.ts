import type {
  BuzzerState,
  Player as PrismaPlayer,
  Team as PrismaTeam,
  ScorebarTimerState,
  TeamAvatarImage,
} from "@prisma/client";
import { ObjectId } from "bson";
import { type TUserReduced } from "~/types/socket.types";
import Player from "../Player/Player";
import type { TPlayer } from "../Player/player.types";

export const SCOREBAR_TIMER_SECONDS = 5;

export default class Team implements PrismaTeam {
  id: string;
  name: string;
  totalScore: number;
  gameScore: number;
  avatarImage: string;
  avatarImageList: TeamAvatarImage[];
  players: PrismaPlayer[];
  buzzer: BuzzerState;
  scorebarTimer: ScorebarTimerState;
  isActiveTurn: boolean;

  public constructor(team: PrismaTeam) {
    this.id = team.id;
    this.name = team.name;
    this.totalScore = team.totalScore;
    this.gameScore = team.gameScore;
    this.avatarImage = team.avatarImage;
    this.avatarImageList = team.avatarImageList;
    this.players = team.players.map((player) => new Player(player));
    this.buzzer = team.buzzer;
    this.scorebarTimer = team.scorebarTimer;
    this.isActiveTurn = team.isActiveTurn;
  }

  static createTeam(name: string): PrismaTeam {
    return {
      id: new ObjectId().toString(),
      name,
      avatarImage: "",
      avatarImageList: [],
      buzzer: {
        isPressed: false,
        playersBuzzered: [],
      },
      totalScore: 0,
      gameScore: 0,
      isActiveTurn: false,
      players: [],
      scorebarTimer: {
        isActive: false,
        seconds: 5, // default seconds
      },
    };
  }

  getPlayer(playerId: string | undefined | null) {
    if (!playerId) return null;

    for (const [playerKey, player] of Object.entries(this.players)) {
      if (player.id === playerId) {
        return {
          playerKey,
          playerNumber: playerKey === "playerOne" ? 0 : 1,
          ...player,
        };
      }
    }

    return null;
  }

  join(user: TUserReduced) {
    const alternativePlayerName = `Spieler ${this.players.length + 1}`;

    const p: TPlayer = {
      name: user.username ?? alternativePlayerName,
      userId: user.id,
      teamId: this.id,
    };
    const newPlayer = new Player(p);

    // take team image from the avatar of the first joined player
    if (this.players.length === 0) {
      this.avatarImage = user.image ?? "";
    }

    const img: TeamAvatarImage = {
      img: user.image ?? "",
      userId: user.id,
    };

    this.avatarImageList.push(img);

    this.players.push(newPlayer);

    return { teamId: this.id, playerId: newPlayer.id };
  }

  removePlayer(userId: string) {
    const player = this.players.find((p) => p.userId === userId);
    this.players = this.players.filter((p) => p.userId !== userId);

    this.avatarImageList = this.avatarImageList.filter((avatar) => avatar.userId !== player?.userId);
  }

  increaseGameScore(step = 1) {
    this.gameScore += step;
  }

  decreaseGameScore(step = 1) {
    if (this.gameScore === 0) return;
    this.gameScore -= step;
  }

  resetGameScore() {
    this.gameScore = 0;
  }

  increaseTotalScore(step = 1) {
    this.totalScore += step;
  }

  decreaseTotalScore(step = 1) {
    if (this.totalScore === 0) return;
    this.totalScore -= step;
  }

  resetTotalScore() {
    this.totalScore = 0;
  }

  startScorebarTimer() {
    this.scorebarTimer.isActive = true;
  }

  stopScorebarTimer() {
    this.scorebarTimer.isActive = false;
  }
}
