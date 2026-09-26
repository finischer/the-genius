import * as Y from "yjs";
import { syncedStore, getYjsValue } from "@syncedstore/core";
import { test } from "../../fixtures/auth";
import { expect } from "@playwright/test";
import { startPartykitMock } from "../../helpers/partykit-mock";
import { RoomPage } from "../../pages/RoomPage";

// ── Set game fixture data ────────────────────────────────────────────────────
//
// We build one question with 6 cards and two openedCards groups:
//
//   Valid set  → cards 0, 1, 2
//     form:   oval  / oval  / oval    → all same ✓
//     color:  red   / green / blue    → all different ✓
//     fill:   filled/ filled/ filled  → all same ✓
//     amount: 1     / 2     / 3       → all different ✓
//
//   Invalid combo → cards 3, 4, 5
//     form:   rectangle / rectangle / diamond → 2×same, 1×different ✗
//     (this alone makes it invalid)

const SET_CARDS = [
  // ── valid set ──────────────────────────────────────
  { id: "c0", form: "oval", color: "red", fill: "filled", amount: 1 },
  { id: "c1", form: "oval", color: "green", fill: "filled", amount: 2 },
  { id: "c2", form: "oval", color: "blue", fill: "filled", amount: 3 },
  // ── no-set group ──────────────────────────────────
  { id: "c3", form: "rectangle", color: "red", fill: "none", amount: 1 },
  { id: "c4", form: "rectangle", color: "red", fill: "dashed", amount: 2 },
  { id: "c5", form: "diamond", color: "blue", fill: "filled", amount: 3 }
];

const SET_GAME = {
  identifier: "set",
  name: "Set",
  maxPoints: 7,
  scorebarMode: "circle",
  modes: ["DUELL", "TEAM"],
  questions: [
    {
      id: "q1",
      cards: SET_CARDS
    }
  ],
  qIndex: 0,
  // All cards are pre-flipped so the moderator can immediately select them
  openedCards: [0, 1, 2, 3, 4, 5],
  markedCards: [],
  markedCardsState: "marked",
  display: { cards: true, markedCards: false },
  rules: ""
};

function generateRoomId(): string {
  return `e2e-set-${Math.random().toString(36).slice(2, 9)}`;
}

// ── Test suite ────────────────────────────────────────────────────────────────

/**
 * Task 11.8 – Requirements 7.3, 14.1, 14.2, 14.3
 *
 * Verifies the Set game flow:
 *  - Card grid is visible within 3 s after game activation (14.1)
 *  - Selecting 3 valid-Set cards → markedCardsState = "correct" and green border (14.2)
 *  - Selecting 3 invalid cards → markedCardsState = "wrong" and red border (14.3)
 */
test.describe("Set – Karten-Grid und Set-Validierung", () => {
  test("Karten-Grid sichtbar; valides Set → correct, invalides Set → wrong", async ({
    authenticatedContext
  }) => {
    // ── Setup: start PartyKit mock ───────────────────────────────────────────
    const mockServer = await startPartykitMock(1991).catch(() => {
      throw new Error(
        "PartyKit mock failed to start on port 1991 – port may already be in use"
      );
    });

    // ── Create a Gameshow with a Set game ────────────────────────────────────
    const gameshowRes = await authenticatedContext.request.post(
      "/api/trpc/gameshows.create",
      {
        data: { json: { name: "E2E Set Gameshow", games: [SET_GAME] } },
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

    // ── Build and seed the room Yjs state ────────────────────────────────────
    const roomState = {
      id: roomId,
      creatorId: "e2e-user",
      name: "E2E Set Room",
      maxPlayersPerTeam: 1,
      games: [SET_GAME],
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

    // ── Run the test ─────────────────────────────────────────────────────────
    const page = await authenticatedContext.newPage();
    const roomPage = new RoomPage(page);

    // Track console errors (Requirement 7.1)
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    try {
      await roomPage.goto(roomId);
      await roomPage.waitForRoomLoaded();

      // ── Activate the Set game via ModPanel ───────────────────────────────
      await roomPage.openModPanel();
      await roomPage.expandStartGameAccordion();

      const gamePanel = page.locator(
        ".mod-panel-start-games-accordion .mantine-Accordion-panel"
      );
      const setBtn = gamePanel
        .locator(".mantine-Button-root", { hasText: "Set" })
        .first();
      await expect(setBtn).toBeVisible({ timeout: 3000 });
      await setBtn.click();

      // Wait for the active-game indicator
      await expect(
        gamePanel
          .locator(".mantine-Button-root", { hasText: "Set" })
          .filter({ hasText: "(Läuft gerade)" })
      ).toBeVisible({ timeout: 3000 });

      // Close the ModPanel to expose the game area
      await page.keyboard.press("Escape");

      // ── Requirement 7.2: game area contains [data-game="set"] ────────────
      const gameArea = page.locator('[data-testid="game-area"]');
      await expect(gameArea).toBeVisible({ timeout: 5000 });
      const setArea = gameArea.locator('[data-game="set"]');
      await expect(setArea).toBeVisible({ timeout: 3000 });

      // ── Requirement 14.1: card grid visible within 3 s ───────────────────
      // SetGame renders cards as motion.div elements inside a SimpleGrid.
      // Each flipped card shows BackContent (the forms), non-flipped shows the
      // number. Because openedCards = [0..5] was seeded, all 6 cards are flipped.
      // We verify that the SimpleGrid contains at least 3 card elements.
      const setCards = setArea.locator(".mantine-SimpleGrid-root > div");
      await expect(setCards).toHaveCount(6, { timeout: 3000 });

      // ── Requirement 14.2: valid Set → markedCardsState = "correct" ───────
      //
      // Flow:
      //   1. Click cards 1, 2, 3 (indices 0, 1, 2 → valid set)
      //   2. Click "Markierte Karten zeigen" → display.markedCards = true
      //   3. Click "Antwort zeigen"          → markedCardsState = "correct"
      //   4. Verify the 3 cards have a green border

      // Cards are positioned in a 3-column SimpleGrid. Each card is a motion.div
      // (the root of SetCard). We click the first 3 (indices 0, 1, 2).
      const allCards = setArea.locator(".mantine-SimpleGrid-root > div");

      await allCards.nth(0).click();
      await allCards.nth(1).click();
      await allCards.nth(2).click();

      // "Markierte Karten zeigen" becomes enabled after 3 cards are selected
      const markedBtn = setArea.locator("button", {
        hasText: "Markierte Karten zeigen"
      });
      await expect(markedBtn).toBeEnabled({ timeout: 2000 });
      await markedBtn.click();

      // After display.markedCards = true the label switches to "Antwort zeigen"
      const answerBtn = setArea.locator("button", {
        hasText: "Antwort zeigen"
      });
      await expect(answerBtn).toBeEnabled({ timeout: 2000 });
      await answerBtn.click();

      // SetCard applies border: "6px solid green" when marked && markerState="correct"
      // We poll for at least one card with a green border
      await expect
        .poll(
          async () => {
            const borders = await allCards.evaluateAll((els) =>
              els.map((el) => (el as HTMLElement).style.border)
            );
            return borders.some((b) => b.includes("green"));
          },
          { timeout: 2000 }
        )
        .toBeTruthy();

      // ── Reset state for next scenario ─────────────────────────────────────
      // "Karten umdrehen" resets markedCards, markedCardsState and openedCards
      const flipBtn = setArea.locator("button", { hasText: "Karten umdrehen" });
      await expect(flipBtn).toBeVisible({ timeout: 2000 });
      // Click twice: once to close all (openedCards=[]), once to open all again
      await flipBtn.click();
      await flipBtn.click();

      // Wait for cards to be visible again (all flipped open)
      await expect(allCards).toHaveCount(6, { timeout: 2000 });

      // ── Requirement 14.3: invalid combo → markedCardsState = "wrong" ─────
      //
      // Cards 3, 4, 5 (indices 3, 4, 5) do not form a valid Set:
      //   form: rectangle / rectangle / diamond → neither all-same nor all-different

      await allCards.nth(3).click();
      await allCards.nth(4).click();
      await allCards.nth(5).click();

      const markedBtn2 = setArea.locator("button", {
        hasText: "Markierte Karten zeigen"
      });
      await expect(markedBtn2).toBeEnabled({ timeout: 2000 });
      await markedBtn2.click();

      const answerBtn2 = setArea.locator("button", {
        hasText: "Antwort zeigen"
      });
      await expect(answerBtn2).toBeEnabled({ timeout: 2000 });
      await answerBtn2.click();

      // Cards with wrong markerState get a red border
      await expect
        .poll(
          async () => {
            const borders = await allCards.evaluateAll((els) =>
              els.map((el) => (el as HTMLElement).style.border)
            );
            return borders.some((b) => b.includes("red"));
          },
          { timeout: 2000 }
        )
        .toBeTruthy();

      // No JS errors throughout the test (Requirement 7.1)
      expect(consoleErrors).toHaveLength(0);
    } finally {
      await page.close();

      // ── Cleanup ──────────────────────────────────────────────────────────
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
});
