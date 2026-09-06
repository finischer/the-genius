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
  maxPlayersPerTeam: number;
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
    /** Tracks visibility of individually togglable UI components by ID. */
    componentVisibility: Record<string, boolean>;
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

export type TeamAvatarImage = {
  img: string;
  userId: string;
};

export type BuzzerState = {
  isLocked: boolean;
  isPressed: boolean;
  playersBuzzered: string[];
};

export type RoomSounds = {
  bass: boolean;
  bell: boolean;
  buzzer: boolean;
  winning: boolean;
  intro: boolean;
  shimmer: boolean;
  typewriter: boolean;
  warningBuzzer: boolean;
  whoosh_1: boolean;
};

export type RoomMusic = {
  title: string;
  isActive: boolean;
};

export type RoomState = {
  currentView: string;
  answerState: {
    showAnswer: boolean;
    answer: string;
    withSound: boolean;
  };
  gameshowStarted: boolean;
  teamWithTurn: string;
  display: {
    confetti: boolean;
    gameIntro: {
      alreadyPlayed: boolean;
      flippedTitleBanner: boolean;
      milliseconds: number;
    };
    game: boolean;
    notefields: boolean;
    clock: {
      isActive: boolean;
      currentSeconds: number;
      to: number;
      variant: "COUNTDOWN" | "TIMER";
    };
  };
  sounds: RoomSounds;
  music: RoomMusic;
  view: "EMPTY" | "GAME" | "SCOREBOARD";
};

export type PlayerStates = {
  notefield: NoteFieldState;
};

export type PlayerSharedState = {
  duSagst: {
    answer: number;
  };
};

export type PrismaPlayer = {
  id: string;
  name: string;
  userId: string;
  teamId: string;
  states: PlayerStates;
  shared: PlayerSharedState;
};

export type ScorebarTimerState = {
  isActive: boolean;
  seconds: number;
};

export type PrismaTeam = {
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
};
