import { getYjsValue, syncedStore } from "@syncedstore/core";
import * as Y from "yjs";

const createTeam = (id: string, name: string) => ({
  id,
  name,
  shortName: id,
  avatarImage: "",
  avatarImageList: [] as string[],
  buzzer: {
    isLocked: false,
    isPressed: false,
    playersBuzzered: [] as string[]
  },
  totalScore: 0,
  gameScore: 0,
  isActiveTurn: false,
  players: [] as string[],
  scorebarTimer: { id: null, currSeconds: 0, initSeconds: 10, active: false }
});

/** Mirrors the room state created by `initRoom` in src/config/store.ts. */
export interface IRoomStateOptions {
  teamOneName?: string;
  teamTwoName?: string;
  creatorId?: string;
  maxPlayersPerTeam?: number;
}

export function buildRoomState(
  roomId: string,
  name: string,
  games: readonly unknown[],
  {
    teamOneName = "Team 1",
    teamTwoName = "Team 2",
    creatorId = "e2e-user",
    maxPlayersPerTeam = 1
  }: IRoomStateOptions = {}
) {
  return {
    id: roomId,
    creatorId,
    name,
    maxPlayersPerTeam,
    games,
    teams: {
      teamOne: createTeam("t1", teamOneName),
      teamTwo: createTeam("t2", teamTwoName)
    },
    context: {
      isClosed: false,
      currentGame: {},
      view: "empty",
      header: {
        timer: { id: null, active: false, currSeconds: 0, initSeconds: 0 }
      },
      audio: { sounds: {}, music: { isActive: false, title: "" } },
      answerState: { answer: "", isAnswerDisplayed: false },
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
  };
}

export function encodeRoomState(
  state: ReturnType<typeof buildRoomState>
): Uint8Array {
  const doc = new Y.Doc();
  const store = syncedStore({ room: {} as { state: typeof state } }, doc);
  store.room.state = state;
  return Y.encodeStateAsUpdate(getYjsValue(store) as Y.Doc);
}
