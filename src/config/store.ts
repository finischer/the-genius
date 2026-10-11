import { randomId } from "@mantine/hooks";
import type { RoomSounds } from "~/types/gameshow.types";
import { getYjsValue, syncedStore, type Y } from "@syncedstore/core";
import YProvider from "y-partyserver/provider";
import { PARTYKIT_HOST } from "~/utils/env";
import {
  RoomView,
  type Player,
  type Room,
  type Team,
  type TeamShortNames
} from "~/types/gameshow.types";
import { roomConfig } from "./room.config";
import { parseBuzzResult, type TBuzzRequest } from "./buzzerProtocol";
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

let activeProvider: YProvider | undefined;
const BUZZ_RESULT_TIMEOUT_MS = 1500;
const pendingBuzzes = new Map<string, Array<(granted: boolean) => void>>();

// Resolves with the server's verdict. Without a connection or answer the
// press is granted so the buzzer never feels dead.
export const requestBuzz = (teamId: string): Promise<boolean> => {
  const provider = activeProvider;
  if (!provider?.wsconnected) return Promise.resolve(true);

  return new Promise((resolve) => {
    const queue = pendingBuzzes.get(teamId) ?? [];
    const timeout = setTimeout(() => {
      const index = queue.indexOf(settle);
      if (index >= 0) queue.splice(index, 1);
      resolve(true);
    }, BUZZ_RESULT_TIMEOUT_MS);
    const settle = (granted: boolean) => {
      clearTimeout(timeout);
      resolve(granted);
    };
    queue.push(settle);
    pendingBuzzes.set(teamId, queue);

    const request: TBuzzRequest = { type: "buzz", teamId };
    provider.sendMessage(JSON.stringify(request));
  });
};

const handleCustomMessage = (message: string) => {
  const result = parseBuzzResult(message);
  if (result) pendingBuzzes.get(result.teamId)?.shift()?.(result.granted);
};

export const connectToSocket = (roomId: string) => {
  if (!roomId) return;

  const provider = new YProvider(
    PARTYKIT_HOST,
    roomId,
    getYjsValue(roomStore) as Y.Doc
  );
  provider.on("custom-message", handleCustomMessage);

  activeProvider = provider;
  return provider;
};
