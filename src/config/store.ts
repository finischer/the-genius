import { randomId } from "@mantine/hooks";
import { getYjsValue, syncedStore } from "@syncedstore/core";
import { WebsocketProvider } from "y-partykit/provider";
import type { TGame } from "~/components/room/Game/games/game.types";
import { RoomView, type Player, type Room, type Team } from "~/types/gameshow.types";

export const initRoom = (name: string, password: string, games: TGame[], creatorId: string): Room => ({
  id: randomId(),
  creatorId,
  name,
  password,
  teams: {
    teamOne: initTeam("Team 1"),
    teamTwo: initTeam("Team 2"),
  },
  games,
  context: {
    view: RoomView.EMPTY,
    answerState: {
      answer: "",
      isAnswerDisplayed: false,
    },
    display: {
      confetti: false,
      roomTimer: false,
    },
  },
});

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
