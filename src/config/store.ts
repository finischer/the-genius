import { randomId } from "@mantine/hooks";
import type { RoomSounds } from "~/types/gameshow.types";
import { getYjsValue, syncedStore, type Y } from "@syncedstore/core";
import YPartyKitProvider from "y-partykit/provider";
import { PARTYKIT_HOST } from "~/utils/env";
import {
  RoomView,
  type Player,
  type Room,
  type Team,
  type TeamShortNames
} from "~/types/gameshow.types";
import { roomConfig } from "./room.config";
import {
  encodeBuzzRequest,
  isBuzzStamp,
  type TBuzzRequest,
  type TBuzzStamp
} from "./buzzerProtocol";
import type { GameState } from "~/games";

export const initRoom = (
  name: string,
  games: GameState[],
  creatorId: string,
  maxPlayersPerTeam: number = 1
): Room => ({
  id: randomId(),
  creatorId,
  name,
  maxPlayersPerTeam,
  teams: {
    teamOne: initTeam("Team 1", "t1"),
    teamTwo: initTeam("Team 2", "t2")
  },
  games,
  context: {
    isClosed: false,
    currentGame: {} as GameState | null,
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
    },
    componentVisibility: {}
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

const roomStore = syncedStore({
  room: {} as RoomStore
});

// React Fast Refresh inspects every module export (e.g. for `$$typeof`),
// which makes the SyncedStore root proxy log a warning. Exposing it through a
// function keeps the proxy out of the module exports.
export const getRoomStore = () => roomStore;

export const runInTransaction = (fn: () => void) => {
  (getYjsValue(roomStore) as Y.Doc).transact(fn);
};

let activeProvider: YPartyKitProvider | undefined;
const buzzStamps = new Map<string, TBuzzStamp>();

export const getBuzzStamp = (teamId: string) => buzzStamps.get(teamId);
export const clearBuzzStamp = (teamId: string) => buzzStamps.delete(teamId);

// Must be called before writing the buzz to the Yjs doc: both travel over the
// same socket, so the stamp reaches the host before the state change does.
export const sendBuzz = (teamId: string) => {
  const request: TBuzzRequest = { type: "buzz", teamId };
  activeProvider?.ws?.send(encodeBuzzRequest(request));
};

const handleStampMessage = (event: MessageEvent) => {
  if (typeof event.data !== "string") return;
  try {
    const parsed: unknown = JSON.parse(event.data);
    if (isBuzzStamp(parsed)) buzzStamps.set(parsed.teamId, parsed);
  } catch {
    // not a buzzer message
  }
};

export const connectToSocket = (roomId: string) => {
  if (!roomId) return;

  const provider = new YPartyKitProvider(
    PARTYKIT_HOST,
    roomId,
    getYjsValue(roomStore) as Y.Doc
  ); // sync via partykit

  // The underlying WebSocket is recreated on every reconnect
  provider.on("status", ({ status }: { status: string }) => {
    if (status === "connected") {
      provider.ws?.addEventListener("message", handleStampMessage);
    }
  });

  activeProvider = provider;
  return provider;
};
