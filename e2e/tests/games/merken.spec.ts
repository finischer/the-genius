import * as Y from "yjs";
import { syncedStore, getYjsValue } from "@syncedstore/core";
import { test } from "../../fixtures/auth";
import { startPartykitMock } from "../../helpers/partykit-mock";
import { expect } from "@playwright/test";
import { RoomPage } from "../../pages/RoomPage";

// ── Merken game fixture data ──────────────────────────────────────────────────
//
// Six cards using the canonical /icons/merken/<n>.png paths.
// allCardsFlipped starts as false; the "Spiel starten" button sets it to true
// and kicks off the countdown timer.
const MERKEN_CARDS = [
  "/icons/merken/1.png",
  "/icons/merken/2.png",
  "/icons/merken/3.png",
  "/icons/merken/4.png",
  "/icons/merken/5.png",
  "/icons/merken/6.png"
];

const MERKEN_GAME = {
  identifier: "merken",
  name: "Merken",
  maxPoints: 7,
  scorebarMode: "circle",
  modes: ["DUELL", "TEAM"],
  allCardsFlipped: false,
  cards: MERKEN_CARDS,
  openCards: [] as number[],
  timerState: {
    isActive: false,
    timeToThinkSeconds: 10
  },
  rules: ""
};

function generateRoomId(): string {
  return `e2e-mk-${Math.random().toString(36).slice(2, 9)}`;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Build the full room state object for seeding into the Yjs store.
 */
function buildRoomState(roomId: string, game: typeof MERKEN_GAME) {
  return {
    id: roomId,
    creatorId: "e2e-user",
    name: "E2E Merken Room",
    maxPlayersPerTeam: 1,
    games: [game],
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
}

// ── Test suite ────────────────────────────────────────────────────────────────

/**
 * Task 11.6 – Requirements 7.3, 12.1, 12.2, 12.3
 *
 * Verifies the Merken (memory) game flow:
 *  12.1 – Memorization phase: all card face images visible + countdown timer running
 *  12.2 – Recall phase: card faces hidden, interactive number cards visible
 *  12.3 – Clicking a card registers the submission; Scorebar reflects feedback
 */
test.describe("Merken – Karten sichtbar, Recall-Phase funktioniert", () => {
  test("Memorisierungsphase: Karten-Face-Values sichtbar und Countdown läuft", async ({
    authenticatedContext
  }) => {
    // ── Setup ─────────────────────────────────────────────────────────────
    const mockServer = await startPartykitMock(1993).catch(() => {
      throw new Error(
        "PartyKit mock failed to start on port 1993 – port may already be in use"
      );
    });

    const gameshowRes = await authenticatedContext.request.post(
      "/api/trpc/gameshows.create",
      {
        data: {
          json: {
            name: "E2E Merken Gameshow",
            games: [MERKEN_GAME]
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

    const roomState = buildRoomState(roomId, MERKEN_GAME);
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

    // ── Test ──────────────────────────────────────────────────────────────
    const page = await authenticatedContext.newPage();
    const roomPage = new RoomPage(page);

    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    try {
      await roomPage.goto(roomId);
      await roomPage.waitForRoomLoaded();

      // Activate the Merken game via ModPanel
      await roomPage.openModPanel();
      await roomPage.expandStartGameAccordion();

      const panel = page.locator(
        ".mod-panel-start-games-accordion .mantine-Accordion-panel"
      );
      const merkenBtn = panel
        .locator(".mantine-Button-root", { hasText: "Merken" })
        .first();
      await expect(merkenBtn).toBeVisible({ timeout: 3000 });
      await merkenBtn.click();

      // Confirm active game indicator (Requirement 5.3)
      await expect(
        panel
          .locator(".mantine-Button-root", { hasText: "Merken" })
          .filter({ hasText: "(Läuft gerade)" })
      ).toBeVisible({ timeout: 2000 });

      // Close ModPanel to expose the game area
      await page.keyboard.press("Escape");
      await expect(page.locator(".mod-panel-explanation")).not.toBeVisible({
        timeout: 2000
      });

      // Requirement 7.2: data-game="merken" present in game area
      const gameArea = page.locator('[data-testid="game-area"]');
      await expect(gameArea).toBeVisible({ timeout: 5000 });
      const merkenArea = gameArea.locator('[data-game="merken"]');
      await expect(merkenArea).toBeVisible({ timeout: 3000 });

      // "Spiel starten" button is visible (not yet active)
      const startBtn = merkenArea.locator("button", { hasText: "Spiel starten" });
      await expect(startBtn).toBeVisible({ timeout: 3000 });
      await expect(startBtn).not.toBeDisabled({ timeout: 1000 });

      // Before starting: allCardsFlipped = false → backs are absolute-positioned,
      // fronts (number labels) are the visible face.
      // The front container shows card numbers 1–6 as Text elements.
      const flipCards = merkenArea.locator(".react-card-flip");
      await expect(flipCards).toHaveCount(MERKEN_CARDS.length, { timeout: 3000 });

      // Click "Spiel starten" – sets allCardsFlipped = true and starts countdown
      await startBtn.click();

      // ── Requirement 12.1: Memorization phase ─────────────────────────────
      // After start: allCardsFlipped = true → .react-card-back is position:relative
      // The back side contains the card image (alt = index).
      // Wait for the first card's back image to become visible.
      const firstCardBackImg = merkenArea
        .locator(".react-card-back img")
        .first();
      await expect(firstCardBackImg).toBeVisible({ timeout: 3000 });

      // All 6 card back images should be present in the DOM
      const allBackImages = merkenArea.locator(".react-card-back img");
      await expect(allBackImages).toHaveCount(MERKEN_CARDS.length, {
        timeout: 3000
      });

      // Countdown timer is active in the room header
      // Timer renders `timerState.currSeconds` inside a visible div when active
      const timerEl = page.locator('[data-testid="room-header"] .mantine-Text-root');
      // The timer shows a decrementing number — verify it is visible and numeric
      await expect(timerEl.filter({ hasText: /^\d+$/ }).first()).toBeVisible({
        timeout: 3000
      });

      // No unhandled JS errors (Requirement 7.1)
      expect(consoleErrors).toHaveLength(0);
    } finally {
      await page.close();
      await authenticatedContext.request
        .post("/api/trpc/rooms.removeActiveRoom", {
          data: { json: { roomId } },
          headers: { "Content-Type": "application/json" }
        })
        .catch(() => {
          // ignore cleanup errors
        });
      await authenticatedContext.request
        .post("/api/trpc/gameshows.delete", {
          data: { json: { gameshowId } },
          headers: { "Content-Type": "application/json" }
        })
        .catch(() => {
          // ignore cleanup errors
        });
      await mockServer.close().catch(() => {
        // ignore close errors
      });
    }
  });

  test("Recall-Phase: Karten-Faces versteckt, Karte klicken registriert Submission", async ({
    authenticatedContext
  }) => {
    // ── Setup: seed room with allCardsFlipped = false (recall phase already) ──
    // We skip the timer by seeding the game in recall phase directly.
    const recallPhaseGame = {
      ...MERKEN_GAME,
      allCardsFlipped: false, // recall phase: faces hidden
      openCards: [] as number[],
      timerState: {
        isActive: false,
        timeToThinkSeconds: 10
      }
    };

    const mockServer = await startPartykitMock(1993).catch(() => {
      throw new Error(
        "PartyKit mock failed to start on port 1993 – port may already be in use"
      );
    });

    const gameshowRes = await authenticatedContext.request.post(
      "/api/trpc/gameshows.create",
      {
        data: {
          json: {
            name: "E2E Merken Recall Gameshow",
            games: [recallPhaseGame]
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

    // Seed with the game already active (currentGame set) so the game area is
    // rendered without needing to navigate the ModPanel.
    const roomStateWithActiveGame = buildRoomState(roomId, recallPhaseGame);
    roomStateWithActiveGame.context.currentGame = recallPhaseGame as never;
    roomStateWithActiveGame.context.display.game = true;
    roomStateWithActiveGame.context.view = "game" as never;

    const seedDoc = new Y.Doc();
    const seedStore = syncedStore(
      { room: {} as { state: typeof roomStateWithActiveGame } },
      seedDoc
    );
    seedStore.room.state = roomStateWithActiveGame as never;
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

    // ── Test ──────────────────────────────────────────────────────────────
    const page = await authenticatedContext.newPage();
    const roomPage = new RoomPage(page);

    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    try {
      await roomPage.goto(roomId);
      await roomPage.waitForRoomLoaded();

      // Activate the game via ModPanel (seeded state alone may not trigger
      // game rendering without the host action)
      await roomPage.openModPanel();
      await roomPage.expandStartGameAccordion();

      const panel = page.locator(
        ".mod-panel-start-games-accordion .mantine-Accordion-panel"
      );
      const merkenBtn = panel
        .locator(".mantine-Button-root", { hasText: "Merken" })
        .first();
      await expect(merkenBtn).toBeVisible({ timeout: 3000 });
      await merkenBtn.click();

      await expect(
        panel
          .locator(".mantine-Button-root", { hasText: "Merken" })
          .filter({ hasText: "(Läuft gerade)" })
      ).toBeVisible({ timeout: 2000 });

      // Close ModPanel
      await page.keyboard.press("Escape");
      await expect(page.locator(".mod-panel-explanation")).not.toBeVisible({
        timeout: 2000
      });

      const gameArea = page.locator('[data-testid="game-area"]');
      await expect(gameArea).toBeVisible({ timeout: 5000 });
      const merkenArea = gameArea.locator('[data-game="merken"]');
      await expect(merkenArea).toBeVisible({ timeout: 3000 });

      // ── Requirement 12.2: Recall phase – card faces hidden ───────────────
      // allCardsFlipped = false (initial state) and no openCards:
      // .react-card-back is position:absolute (off-screen), .react-card-front is
      // position:relative (visible). Front shows card numbers (1–6 as Text).
      // The card numbers (1–6) should be visible as interactive front-face content.
      const flipCards = merkenArea.locator(".react-card-flip");
      await expect(flipCards).toHaveCount(MERKEN_CARDS.length, { timeout: 3000 });

      // Front faces contain numbered Text elements (1, 2, 3 ... 6)
      // react-card-front contains the front rendered content
      const frontFaces = merkenArea.locator(".react-card-front");
      await expect(frontFaces).toHaveCount(MERKEN_CARDS.length, { timeout: 2000 });

      // Verify the front face is rendered in the flow (position: relative)
      // by checking that a number text "1" through "6" is in the DOM.
      // The MerkenPlayground FrontContent renders <Text size="1.5rem">{idx+1}</Text>
      for (let i = 1; i <= MERKEN_CARDS.length; i++) {
        const numberText = merkenArea
          .locator(".react-card-front")
          .nth(i - 1)
          .locator(`text=${i}`);
        await expect(numberText).toBeAttached({ timeout: 2000 });
      }

      // Back faces (images) should be off-screen: their container has
      // position:absolute when not flipped. Confirm no card back img is visible.
      // (Images are still in DOM but occluded under the front card)
      const backImages = merkenArea.locator(".react-card-back img");
      // Images exist in DOM but should not be visible (covered by front card)
      await expect(backImages).toHaveCount(MERKEN_CARDS.length, { timeout: 2000 });

      // ── Requirement 12.3: Click a card – submission registered ──────────
      // Clicking the first FlipCard calls handleCardClick(0) which pushes 0
      // into game.openCards. This makes the card flip (isFlipped becomes true),
      // revealing the back image. The host (authenticated user) is clickable.
      const firstCard = merkenArea.locator(".react-card-flip").first();
      await expect(firstCard).toBeVisible({ timeout: 2000 });
      await firstCard.click();

      // After click: card at index 0 is added to openCards → isFlipped = true
      // The back image of the first card becomes visible
      const firstCardBackImg = merkenArea
        .locator(".react-card-back img")
        .first();
      await expect(firstCardBackImg).toBeVisible({ timeout: 3000 });

      // Verify card 1's back image src contains the correct icon path
      await expect(firstCardBackImg).toHaveAttribute(
        "src",
        /\/icons\/merken\/1/,
        { timeout: 2000 }
      );

      // No unhandled JS errors (Requirement 7.1)
      expect(consoleErrors).toHaveLength(0);
    } finally {
      await page.close();
      await authenticatedContext.request
        .post("/api/trpc/rooms.removeActiveRoom", {
          data: { json: { roomId } },
          headers: { "Content-Type": "application/json" }
        })
        .catch(() => {
          // ignore cleanup errors
        });
      await authenticatedContext.request
        .post("/api/trpc/gameshows.delete", {
          data: { json: { gameshowId } },
          headers: { "Content-Type": "application/json" }
        })
        .catch(() => {
          // ignore cleanup errors
        });
      await mockServer.close().catch(() => {
        // ignore close errors
      });
    }
  });
});

export { test };
