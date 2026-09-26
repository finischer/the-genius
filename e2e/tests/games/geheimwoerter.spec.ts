import * as Y from "yjs";
import { syncedStore, getYjsValue } from "@syncedstore/core";
import { test } from "../../fixtures/auth";
import { startPartykitMock } from "../../helpers/partykit-mock";
import { expect } from "@playwright/test";
import { RoomPage } from "../../pages/RoomPage";

// ── Geheimwörter game fixture data ────────────────────────────────────────────

// Two questions with distinct secret words so we can test navigation
const GEHEIMWOERTER_GAME = {
  identifier: "geheimwoerter",
  name: "Geheimwörter",
  maxPoints: 7,
  scorebarMode: "circle",
  modes: ["DUELL", "TEAM"],
  answer: "",
  qIndex: 0,
  codeList: [
    { id: "cl1", code: "A", category: "Automarke" },
    { id: "cl2", code: "B", category: "Beruf" }
  ],
  questions: [
    {
      id: "q1",
      answer: "APFEL",
      words: [
        { word: "Frucht", category: "Automarke" },
        { word: "Rund", category: "Beruf" }
      ]
    },
    {
      id: "q2",
      answer: "BUCH",
      words: [
        { word: "Lesen", category: "Automarke" },
        { word: "Papier", category: "Beruf" }
      ]
    }
  ],
  display: {
    answer: false,
    codeList: false,
    words: false
  },
  rules: ""
};

function generateRoomId(): string {
  return `e2e-gw-${Math.random().toString(36).slice(2, 9)}`;
}

// ── Test suite ────────────────────────────────────────────────────────────────

/**
 * Task 11.5 – Requirements 7.3, 11.1, 11.2
 *
 * Verifies the Geheimwörter game flow:
 *  - The host (who acts as the describer) can see the word list via ModToggle
 *  - Non-host contexts do NOT see the word list content when display.words = false
 *  - Clicking "Antwort aufdecken" sets display.answer = true
 *  - The answer banner appears after reveal
 */
test.describe("Geheimwörter – Spielablauf", () => {
  test("Wort sichtbar für Beschreiber, nicht für andere; Richtig-Guess setzt display.answer und zeigt Antwort", async ({
    authenticatedContext
  }) => {
    // ── Setup: create a Geheimwörter room ─────────────────────────────────
    const mockServer = await startPartykitMock(1994).catch(() => {
      throw new Error(
        "PartyKit mock failed to start on port 1994 – port may already be in use"
      );
    });

    const gameshowRes = await authenticatedContext.request.post(
      "/api/trpc/gameshows.create",
      {
        data: {
          json: {
            name: "E2E Geheimwörter Gameshow",
            games: [GEHEIMWOERTER_GAME]
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

    // Build room state mirroring the app's store initialisation
    const roomState = {
      id: roomId,
      creatorId: "e2e-user",
      name: "E2E Geheimwörter Room",
      maxPlayersPerTeam: 1,
      games: [GEHEIMWOERTER_GAME],
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

    // ── Test ──────────────────────────────────────────────────────────────────
    const page = await authenticatedContext.newPage();
    const roomPage = new RoomPage(page);

    // Collect console errors to satisfy Requirement 7.1
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    try {
      await roomPage.goto(roomId);
      await roomPage.waitForRoomLoaded();

      // ── Step 1: Activate the Geheimwörter game via ModPanel ──────────────
      await roomPage.openModPanel();
      await roomPage.expandStartGameAccordion();

      const panel = page.locator(
        ".mod-panel-start-games-accordion .mantine-Accordion-panel"
      );
      const geheimBtn = panel
        .locator(".mantine-Button-root", { hasText: "Geheimwörter" })
        .first();
      await expect(geheimBtn).toBeVisible({ timeout: 3000 });
      await geheimBtn.click();

      // Active game indicator within 2 s (Requirement 5.3)
      await expect(
        panel
          .locator(".mantine-Button-root", { hasText: "Geheimwörter" })
          .filter({ hasText: "(Läuft gerade)" })
      ).toBeVisible({ timeout: 2000 });

      // Close ModPanel to expose the game area
      await page.keyboard.press("Escape");
      await expect(page.locator(".mod-panel-explanation")).not.toBeVisible({
        timeout: 2000
      });

      // ── Requirement 7.2: game area contains data-game="geheimwoerter" ────
      const gameArea = page.locator('[data-testid="game-area"]');
      await expect(gameArea).toBeVisible({ timeout: 5000 });
      const geheimArea = gameArea.locator('[data-game="geheimwoerter"]');
      await expect(geheimArea).toBeVisible({ timeout: 3000 });

      // ── Requirement 11.1: Beschreiber (host) sees the word list ──────────
      // The host is always shown the word list via ModToggle (even when
      // display.words = false the host sees it at reduced opacity).
      // The word "Frucht" is part of the first question's words list.
      const wordListBox = geheimArea.locator("text=Frucht");
      await expect(wordListBox).toBeVisible({ timeout: 3000 });

      // ── Requirement 11.1 (non-host): words NOT visible to other contexts ──
      // We verify this via a second browser context that is NOT authenticated
      // as a host. In a real multi-player scenario that context would not have
      // isHost = true. Here we use a fresh anonymous context to simulate a
      // non-moderator viewer: the Yjs componentVisibility for
      // "geheimwoerter-wordlist" is false (not toggled on), so a non-host
      // should not see the word list at all (opacity: 0, pointerEvents: none).
      const spectatorContext = await authenticatedContext.browser()!.newContext();
      const spectatorPage = await spectatorContext.newPage();

      try {
        await spectatorPage.goto(`http://localhost:3000/room/${roomId}`);

        // Spectator page: the geheimwoerter game area should be present
        const spectatorGameArea = spectatorPage.locator(
          '[data-testid="game-area"]'
        );
        await expect(spectatorGameArea).toBeVisible({ timeout: 5000 });
        const spectatorGeheimArea = spectatorGameArea.locator(
          '[data-game="geheimwoerter"]'
        );
        await expect(spectatorGeheimArea).toBeVisible({ timeout: 3000 });

        // The word "Frucht" should NOT be visible to non-host when
        // componentVisibility["geheimwoerter-wordlist"] has not been toggled on.
        // ModToggle sets opacity: 0 for non-host when hidden.
        const spectatorWord = spectatorGeheimArea.locator("text=Frucht");
        await expect(spectatorWord).not.toBeVisible({ timeout: 3000 });
      } finally {
        await spectatorPage.close();
        await spectatorContext.close();
      }

      // ── Requirement 11.2: Richtig-Guess → display.answer = true ──────────
      // The RevealButton is disabled until showWords = true. Toggle the word
      // list on by clicking the ModToggle inner content box (the host can click
      // the children wrapper to toggle). The word list inner Box has
      // onClick={isHost ? toggle : undefined}, so clicking "Frucht" text area
      // acts as the toggle trigger.
      await page.locator("text=Frucht").click({ timeout: 2000 });

      // Wait briefly for visibility state to propagate via Yjs
      await page.waitForTimeout(300);

      // Now "Antwort aufdecken" should become enabled
      const revealBtn = geheimArea.locator("button", {
        hasText: "Antwort aufdecken"
      });
      await expect(revealBtn).toBeVisible({ timeout: 3000 });
      await expect(revealBtn).not.toBeDisabled({ timeout: 2000 });
      await revealBtn.click();

      // After reveal: button shows "Antwort wird angezeigt" (disabled) → display.answer = true
      await expect(
        geheimArea.locator("button", { hasText: "Antwort wird angezeigt" })
      ).toBeVisible({ timeout: 2000 });

      // The AnswerBanner shows the correct answer text "APFEL"
      await expect(page.locator("text=APFEL")).toBeVisible({ timeout: 2000 });

      // No unhandled JS errors during the test (Requirement 7.1)
      expect(consoleErrors).toHaveLength(0);
    } finally {
      await page.close();

      // ── Cleanup ──────────────────────────────────────────────────────────
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
