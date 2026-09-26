import * as Y from "yjs";
import { syncedStore, getYjsValue } from "@syncedstore/core";
import { test } from "../../fixtures/auth";
import { startPartykitMock } from "../../helpers/partykit-mock";
import { expect } from "@playwright/test";
import { RoomPage } from "../../pages/RoomPage";

// ── Flaggen game fixture data ─────────────────────────────────────────────────

// Two real countries so we can verify qIndex navigation (Deutschland → Frankreich)
const FLAGGEN_GAME = {
  identifier: "flaggen",
  name: "Flaggen",
  maxPoints: 7,
  scorebarMode: "circle",
  modes: ["DUELL", "TEAM"],
  countries: [
    { id: "de", shortCode: "de", country: "Deutschland" },
    { id: "fr", shortCode: "fr", country: "Frankreich" }
  ],
  qIndex: 0,
  display: { answer: false, country: false },
  rules: ""
};

function generateRoomId(): string {
  return `e2e-fg-${Math.random().toString(36).slice(2, 9)}`;
}

// ── Test suite ────────────────────────────────────────────────────────────────

/**
 * Task 11.3 – Requirements 7.3, 9.1, 9.2
 *
 * Verifies the Flaggen game flow:
 *  - Flag image for current country is visible within 3 s of game activation
 *  - Clicking "Antwort aufdecken" reveals the country name and sets display.answer
 *  - Clicking "Weiter" advances qIndex by 1 and the next country's flag is shown
 */
test.describe("Flaggen – Spielablauf", () => {
  test("Flagge sichtbar, korrekte Antwort setzt display.answer, Weiter zeigt nächste Flagge", async ({
    authenticatedContext
  }) => {
    // ── Setup: create a Flaggen room with 2 countries ─────────────────────
    const mockServer = await startPartykitMock(1996).catch(() => {
      throw new Error(
        "PartyKit mock failed to start on port 1996 – port may already be in use"
      );
    });

    const gameshowRes = await authenticatedContext.request.post(
      "/api/trpc/gameshows.create",
      {
        data: {
          json: {
            name: "E2E Flaggen Gameshow",
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

    const roomId = generateRoomId();

    // Build room state mirroring the app's store initialisation
    const roomState = {
      id: roomId,
      creatorId: "e2e-user",
      name: "E2E Flaggen Room",
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

      // ── Step 1: Activate the Flaggen game via ModPanel ───────────────────
      await roomPage.openModPanel();
      await roomPage.expandStartGameAccordion();

      const panel = page.locator(
        ".mod-panel-start-games-accordion .mantine-Accordion-panel"
      );
      const flaggenBtn = panel
        .locator(".mantine-Button-root", { hasText: "Flaggen" })
        .first();
      await expect(flaggenBtn).toBeVisible({ timeout: 3000 });
      await flaggenBtn.click();

      // Active game indicator appears within 2 s (Requirement 5.3)
      await expect(
        panel
          .locator(".mantine-Button-root", { hasText: "Flaggen" })
          .filter({ hasText: "(Läuft gerade)" })
      ).toBeVisible({ timeout: 2000 });

      // Close ModPanel to expose the game area
      await page.keyboard.press("Escape");
      await expect(page.locator(".mod-panel-explanation")).not.toBeVisible({
        timeout: 2000
      });

      // ── Requirement 7.2: game area contains data-game="flaggen" ─────────
      const gameArea = page.locator('[data-testid="game-area"]');
      await expect(gameArea).toBeVisible({ timeout: 5000 });
      const flaggenArea = gameArea.locator('[data-game="flaggen"]');
      await expect(flaggenArea).toBeVisible({ timeout: 3000 });

      // ── Requirement 9.1: flag image for first country visible within 3 s ─
      // FlaggenGame renders: <img src="https://flagcdn.com/h240/<shortCode>.png">
      // The image is inside a ModToggle (host sees it even when toggled off).
      const flagImg = flaggenArea.locator('img[src*="flagcdn.com"]').first();
      await expect(flagImg).toBeVisible({ timeout: 3000 });

      // Verify it shows the first country's flag (Deutschland = shortCode "de")
      await expect(flagImg).toHaveAttribute("src", /\/de\.png/, {
        timeout: 3000
      });

      // ── Requirement 9.2: reveal the answer (display.answer = true) ───────
      // RevealButton renders "Antwort aufdecken" when not yet revealed
      const revealBtn = flaggenArea.locator("button", {
        hasText: "Antwort aufdecken"
      });
      await expect(revealBtn).toBeVisible({ timeout: 3000 });
      await revealBtn.click();

      // After reveal, button becomes disabled showing "Antwort wird angezeigt"
      await expect(
        flaggenArea.locator("button", { hasText: "Antwort wird angezeigt" })
      ).toBeVisible({ timeout: 2000 });

      // handleShowAnswerClick sets room.context.answerState.answer = currFlag.country
      // The answer is displayed via the room-wide answerState display component.
      // Verify "Deutschland" is visible somewhere in the page.
      await expect(page.locator("text=Deutschland")).toBeVisible({
        timeout: 2000
      });

      // ── qIndex advances via "Weiter" ─────────────────────────────────────
      // GameNavControls renders "Weiter" (ModView = host only).
      const weiterBtn = page.locator("button", { hasText: "Weiter" }).first();
      await expect(weiterBtn).toBeVisible({ timeout: 3000 });
      await expect(weiterBtn).not.toBeDisabled({ timeout: 1000 });
      await weiterBtn.click();

      // After advancing, flag should change to Frankreich (shortCode "fr")
      await expect(flagImg).toHaveAttribute("src", /\/fr\.png/, {
        timeout: 3000
      });

      // The RevealButton should be available again (display.answer reset to false)
      await expect(
        flaggenArea.locator("button", { hasText: "Antwort aufdecken" })
      ).toBeVisible({ timeout: 2000 });

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

// Use authTest directly — room setup is fully inline, no extra fixtures needed.
export { test };
