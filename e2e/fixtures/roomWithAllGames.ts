import * as Y from "yjs";
import { syncedStore, getYjsValue } from "@syncedstore/core";
import { test as authTest } from "./auth";
import { startPartykitMock } from "../helpers/partykit-mock";

// Minimal but valid game state objects for each of the eight games.
// These mirror the DEFAULT_*_STATE shapes from src/games/*/config.ts, stripped
// to the fields the room state expects and avoiding uuid dependencies at the
// fixture level.

const ALL_GAMES = [
  {
    identifier: "duSagst",
    name: "Du Sagst...",
    maxPoints: 6,
    scorebarMode: "circle",
    modes: ["TEAM"],
    qIndex: 0,
    questions: [],
    timeToThinkSeconds: 30,
    timer: { id: null, active: false, currSeconds: 0, initSeconds: 30 },
    teamStates: {
      t1: {
        id: "t1",
        boxStates: [
          {
            id: "box-t1-1",
            answerIndex: -1,
            answerTheQuestion: true,
            showAnswer: false,
            submitted: true
          },
          {
            id: "box-t1-2",
            answerIndex: -1,
            answerTheQuestion: false,
            showAnswer: false,
            submitted: true
          }
        ]
      },
      t2: {
        id: "t2",
        boxStates: [
          {
            id: "box-t2-1",
            answerIndex: -1,
            answerTheQuestion: true,
            showAnswer: false,
            submitted: true
          },
          {
            id: "box-t2-2",
            answerIndex: -1,
            answerTheQuestion: false,
            showAnswer: false,
            submitted: true
          }
        ]
      }
    },
    display: { answers: [], question: false },
    rules: ""
  },
  {
    identifier: "flaggen",
    name: "Flaggen",
    maxPoints: 7,
    scorebarMode: "circle",
    modes: ["DUELL", "TEAM"],
    countries: [],
    qIndex: 0,
    display: { answer: false, country: false },
    rules: ""
  },
  {
    identifier: "fragenhagel",
    name: "Fragenhagel",
    maxPoints: 20,
    scorebarMode: "number",
    modes: ["DUELL"],
    questions: [],
    configuredIntervals: [
      { id: "1", label: "Intervall 1", start: 25, end: 30 },
      { id: "2", label: "Intervall 2", start: 32, end: 37 },
      { id: "3", label: "Intervall 3", start: 41, end: 46 }
    ],
    qIndex: 0,
    currentScore: 0,
    activePlayerId: null,
    buzzerCount: 0,
    timerState: { isActive: false, seconds: 0 },
    intervalState: { start: -1, end: -1 },
    rules: ""
  },
  {
    identifier: "geheimwoerter",
    name: "Geheimwörter",
    maxPoints: 7,
    scorebarMode: "circle",
    modes: ["DUELL", "TEAM"],
    answer: "",
    questions: [],
    codeList: [],
    display: { answer: false, codeList: false, words: false },
    qIndex: 0,
    rules: ""
  },
  {
    identifier: "merken",
    name: "Merken",
    maxPoints: 7,
    scorebarMode: "circle",
    modes: ["DUELL", "TEAM"],
    allCardsFlipped: false,
    cards: [],
    openCards: [],
    timerState: { isActive: false, timeToThinkSeconds: 60 },
    rules: ""
  },
  {
    identifier: "referatBingo",
    name: "Referat Bingo",
    maxPoints: 999,
    scorebarMode: "number",
    modes: ["TEAM"],
    topics: [],
    qIndex: 0,
    presenter: { id: "", name: "", isPresenting: false },
    notefields: {
      teamOne: {
        answers: ["", "", "", "", "", "", "", "", ""],
        selectedAnswers: [],
        submitted: false
      },
      teamTwo: {
        answers: ["", "", "", "", "", "", "", "", ""],
        selectedAnswers: [],
        submitted: false
      }
    },
    display: {
      notefields: { teamOne: false, teamTwo: false },
      topic: false
    },
    rules: ""
  },
  {
    identifier: "set",
    name: "Set",
    maxPoints: 7,
    scorebarMode: "circle",
    modes: ["DUELL", "TEAM"],
    questions: [],
    openedCards: [],
    markedCards: [],
    markedCardsState: "marked",
    qIndex: 0,
    display: { cards: false, markedCards: false },
    rules: ""
  },
  {
    identifier: "zehnSetzen",
    name: "Zehn Setzen",
    maxPoints: 10,
    scorebarMode: "number",
    modes: ["DUELL", "TEAM"],
    questions: [],
    qIndex: 0,
    teamStates: {
      t1: { id: "t1", answerScores: [0, 0, 0, 0], submitted: false },
      t2: { id: "t2", answerScores: [0, 0, 0, 0], submitted: false }
    },
    display: {
      question: false,
      answers: [],
      correctAnswer: false,
      teamScores: { t1: false, t2: false }
    },
    rules: ""
  }
];

type RoomWithAllGamesFixtures = {
  roomWithAllGamesContext: {
    gameshowId: string;
    roomId: string;
    roomUrl: string;
  };
};

function generateRoomId(): string {
  return `e2e-${Math.random().toString(36).slice(2, 10)}`;
}

export const test = authTest.extend<RoomWithAllGamesFixtures>({
  roomWithAllGamesContext: async ({ authenticatedContext }, use) => {
    const mockServer = await startPartykitMock(1998).catch(() => {
      throw new Error(
        "PartyKit mock failed to start on port 1998 – port may already be in use"
      );
    });

    // Create a gameshow containing all eight games
    const gameshowRes = await authenticatedContext.request.post(
      "/api/trpc/gameshows.create",
      {
        data: {
          json: {
            name: "E2E All-Games Gameshow",
            games: ALL_GAMES
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

    const roomId = generateRoomId();

    // Build room state with all games pre-loaded (mirrors src/config/store.ts)
    const roomState = {
      id: roomId,
      creatorId: "e2e-user",
      name: "E2E All-Games Room",
      maxPlayersPerTeam: 1,
      games: ALL_GAMES,
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

    const seedDoc = new Y.Doc();
    const seedStore = syncedStore(
      { room: {} as { state: typeof roomState } },
      seedDoc
    );
    seedStore.room.state = roomState as never;
    const update = Y.encodeStateAsUpdate(getYjsValue(seedStore) as Y.Doc);

    mockServer.seedRoom(roomId, update);

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
    await authenticatedContext.request
      .post("/api/trpc/rooms.removeActiveRoom", {
        data: { json: { roomId } },
        headers: { "Content-Type": "application/json" }
      })
      .catch(() => undefined);
    await authenticatedContext.request
      .post("/api/trpc/gameshows.delete", {
        data: { json: { gameshowId } },
        headers: { "Content-Type": "application/json" }
      })
      .catch(() => undefined);

    await mockServer.close().catch(() => undefined);
  }
});

export { expect } from "@playwright/test";
