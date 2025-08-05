import { randomId } from "@mantine/hooks";
import type { RoomSounds } from "@prisma/client";
import { getYjsValue, syncedStore, type Y } from "@syncedstore/core";
import { WebsocketProvider } from "y-partykit/provider";
import type { TGame } from "~/components/games/game.types";
import {
  RoomView,
  type Player,
  type Room,
  type Team,
  type TeamShortNames
} from "~/types/gameshow.types";
import { roomConfig } from "./room.config";

export const initRoom = (
  name: string,
  password: string,
  games: TGame[],
  creatorId: string
): Room => ({
  id: randomId(),
  creatorId,
  name,
  password,
  teams: {
    teamOne: initTeam("Team 1", "t1"),
    teamTwo: initTeam("Team 2", "t2")
  },
  games,
  context: {
    isClosed: false,
    currentGame: {} as TGame | null,
    view: RoomView.EMPTY,
    header: {
      timer: {
        id: null,
        active: false,
        currSeconds: 0,
        initSeconds: 0
      }
    },
    audio: {
      sounds: {} as RoomSounds,
      music: {
        isActive: false,
        title: ""
      }
    },
    answerState: {
      answer: "",
      isAnswerDisplayed: false
    },
    gameIntro: {
      alreadyPlayed: false,
      flippedTitleBanner: false,
      milliseconds: 0
    },
    display: {
      confetti: false,
      roomTimer: false,
      gameIntro: false,
      game: false
    }
  }
});

export const initTeam = (name: string, shortName: TeamShortNames): Team => ({
  id: randomId(),
  name,
  shortName,
  avatarImage: "",
  avatarImageList: [],
  buzzer: {
    isLocked: false,
    isPressed: false,
    playersBuzzered: []
  },
  totalScore: 0,
  gameScore: 0,
  isActiveTurn: false,
  players: [],
  scorebarTimer: {
    id: null,
    currSeconds: 0,
    initSeconds: roomConfig.timeAfterBuzzerPressedSeconds,
    active: false
  }
});

export const initPlayer = (
  userId: string,
  username: string,
  teamId: string
): Player => ({
  id: randomId(),
  name: username,
  userId,
  teamId,
  context: {
    notefield: {
      isActive: false,
      value: ""
    },
    duSagst: {
      answer: -1
    }
  }
});

export type RoomStore = {
  state: Room;
};

export const roomStore = syncedStore({
  room: {} as RoomStore
});

export const connectToSocket = (roomId: string) => {
  if (!roomId) return;

  return new WebsocketProvider(
    "wss://yjs.threepointone.partykit.dev/party",
    roomId,
    getYjsValue(roomStore) as Y.Doc
  ); // sync via partykit
};
