import * as Y from "yjs";
import { syncedStore, getYjsValue } from "@syncedstore/core";
import { test as authTest } from "./auth";
import { startPartykitMock } from "../helpers/partykit-mock";

// Minimal game state for Flaggen to use as a test game
const FLAGGEN_GAME = {
  identifier: "flaggen",
  name: "Flaggen",
  maxPoints: 7,
  scorebarMode: "circle",
  modes: ["DUELL", "TEAM"],
  countries: [],
  qIndex: 0,
  display: { answer: false, country: false },
  rules: ""
};

type RoomWithGamesFixtures = {
  roomWithGamesContext: {
    gameshowId: string;
    roomId: string;
    roomUrl: string;
  };
};

function generateRoomId(): string {
  return `e2e-${Math.random().toString(36).slice(2, 10)}`;
}

export const test = authTest.extend<RoomWithGamesFixtures>({
  roomWithGamesContext: async ({ authenticatedContext }, use) => {
    // Start the local PartyKit mock server
    const mockServer = await startPartykitMock(1999).catch(async () => {
      // Port may already be in use from another fixture; start on alternate port
      // and re-throw for clarity
      throw new Error(
        "PartyKit mock failed to start on port 1999 – port may already be in use"
      );
    });

    // Create a gameshow with a Flaggen game
    const gameshowRes = await authenticatedContext.request.post(
      "/api/trpc/gameshows.create",
      {
        data: {
          json: {
            name: "E2E Test Gameshow (with games)",
            games: [FLAGGEN_GAME]
          }
        },
        headers: { "Content-Type": "application/json" }
      }
    );
    if (!gameshowRes.ok()) {
      await mockServer.close();
      throw new Error(`Gameshow creation failed: ${gameshowRes.status()}`);
    }
    const gameshowData = (await gameshowRes.json()) as {
      result: { data: { json: { id: string } } };
    };
    const gameshowId = gameshowData.result.data.json.id;

    // Generate a unique room ID
    const roomId = generateRoomId();

    // Build room state (mirrors src/config/store.ts initRoom)
    const roomState = {
      id: roomId,
      creatorId: "e2e-user",
      name: "E2E Test Room",
      maxPlayersPerTeam: 1,
      games: [FLAGGEN_GAME],
      teams: {
        teamOne: {
          id: "t1",
          name: "Team 1",
          shortName: "t1",
          avatarImage: "",
          avatarImageList: [],
          buzzer: { isLocked: false, isPressed: false, playersBuzzered: [] },
          totalScore: 0,
          gameScore: 0,
          isActiveTurn: false,
          players: [],
          scorebarTimer: {
            id: null,
            currSeconds: 0,
            initSeconds: 10,
            active: false
          }
        },
        teamTwo: {
          id: "t2",
          name: "Team 2",
          shortName: "t2",
          avatarImage: "",
          avatarImageList: [],
          buzzer: { isLocked: false, isPressed: false, playersBuzzered: [] },
          totalScore: 0,
          gameScore: 0,
          isActiveTurn: false,
          players: [],
          scorebarTimer: {
            id: null,
            currSeconds: 0,
            initSeconds: 10,
            active: false
          }
        }
      },
      context: {
        isClosed: false,
        currentGame: null,
        view: "empty",
        header: {
          timer: { id: null, active: false, currSeconds: 0, initSeconds: 0 }
        },
        audio: {
          sounds: {},
          music: { isActive: false, title: "" }
        },
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

    // Build a Yjs update that mirrors how the app's syncedStore sets room.state
    const seedDoc = new Y.Doc();
    const seedStore = syncedStore({ room: {} as { state: typeof roomState } }, seedDoc);
    seedStore.room.state = roomState as never;
    const update = Y.encodeStateAsUpdate(getYjsValue(seedStore) as Y.Doc);

    // Seed the PartyKit mock with the room state before the browser connects
    mockServer.seedRoom(roomId, update);

    // Register the room in the DB
    const roomRes = await authenticatedContext.request.post(
      "/api/trpc/rooms.addRoom",
      {
        data: { json: { id: roomId } },
        headers: { "Content-Type": "application/json" }
      }
    );
    if (!roomRes.ok()) {
      await mockServer.close();
      throw new Error(`Room creation failed: ${roomRes.status()}`);
    }

    await use({ gameshowId, roomId, roomUrl: `/room/${roomId}` });

    // Cleanup
    await authenticatedContext.request.post("/api/trpc/rooms.removeActiveRoom", {
      data: { json: { roomId } },
      headers: { "Content-Type": "application/json" }
    });
    await authenticatedContext.request.post("/api/trpc/gameshows.delete", {
      data: { json: { gameshowId } },
      headers: { "Content-Type": "application/json" }
    });

    await mockServer.close().catch(() => {
      // Ignore errors on close
    });
  }
});

export { expect } from "@playwright/test";
