import { randomId } from "@mantine/hooks";
import type { BuzzerState, ScorebarTimerState, TeamAvatarImage } from "@prisma/client";
import { getYjsValue, syncedStore } from "@syncedstore/core";
import { WebsocketProvider } from "y-partykit/provider";
import type { TRoomTeams } from "~/pages/api/classes/Room/room.types";
import type { Player, Room, Team } from "~/types/gameshow.types";

export const initRoom = (name: string, password: string): Room => {
  return {
    id: randomId(),
    name,
    password,
    teams: {
      teamOne: initTeam("Team 1"),
      teamTwo: initTeam("Team 2"),
    },
    counter: 0,
    intervalId: null,
  };
};

export const initTeam = (name: string): Team => ({
  id: randomId(),
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
    seconds: 5,
  },
});

export const initPlayer = (userId: string, username: string, teamId: string): Player => ({
  id: randomId(),
  name: username,
  userId,
  teamId,
  context: {
    notefield: {
      isActive: false,
      value: "",
    },
  },
});

export type RoomStore = {
  state: Room;
};

export const roomStore = syncedStore({
  room: {} as RoomStore,
});

export const connectToSocket = (roomId: string) => {
  if (!roomId) return;
  new WebsocketProvider("wss://yjs.threepointone.partykit.dev/party", roomId, getYjsValue(roomStore) as any); // sync via partykit
};
