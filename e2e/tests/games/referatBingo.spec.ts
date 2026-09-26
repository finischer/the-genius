/**
 * Task 11.7 – Requirements 7.3, 13.1, 13.2
 *
 * ReferatBingo game tests:
 *  - Requirement 13.1: Bingo grid rendered for each participating team within 3 s
 *  - Requirement 13.2: Player can click a cell to mark it (selectedAnswers update,
 *    visual highlight within 2 s)
 *  - Requirement 7.3: Primary game action triggers observable DOM change within 2 s
 *
 * NOTE: ReferatBingoGame.tsx is currently a stub implementation that only renders
 * `<div data-game="referatBingo">ReferatBingoGame</div>`. The grid-marking and
 * win-notification tests (Req 13.2, 13.3) cannot be implemented against a stub.
 * These tests are marked with `test.fixme` and will be activated once the game
 * component is fully implemented.
 *
 * What IS testable against the stub:
 *  - The game renders with `data-game="referatBingo"` (Req 7.2, covered here
 *    in addition to gameRendering.spec.ts for completeness)
 *  - No uncaught JS exceptions during rendering (Req 7.1)
 */
import * as Y from "yjs";
import { syncedStore, getYjsValue } from "@syncedstore/core";
import { test as authTest, expect } from "../../fixtures/auth";
import { startPartykitMock } from "../../helpers/partykit-mock";
import { RoomPage } from "../../pages/RoomPage";

// ── ReferatBingo game fixture data ────────────────────────────────────────────

const REFERATBINGO_GAME = {
  identifier: "referatBingo",
  name: "Referat Bingo",
  maxPoints: 999,
  scorebarMode: "number",
  modes: ["TEAM"],
  topics: [{ id: "t1", topic: "Klimawandel" }],
  qIndex: 0,
  presenter: { id: "", name: "", isPresenting: false },
  notefields: {
    teamOne: {
      answers: [
        "CO2",
        "Gletscher",
        "Meeresspiegel",
        "Dürre",
        "Überschwemmung",
        "Solar",
        "Wind",
        "Recycling",
        "Emissionen"
      ],
      selectedAnswers: [],
      submitted: false
    },
    teamTwo: {
      answers: [
        "Temperatur",
        "Permafrost",
        "Kohlenstoff",
        "Artensterben",
        "Ozon",
        "Wasserstoff",
        "Biomasse",
        "Treibhaus",
        "Kyoto"
      ],
      selectedAnswers: [],
      submitted: false
    }
  },
  display: {
    notefields: { teamOne: true, teamTwo: true },
    topic: true
  },
  rules: ""
};

function generateRoomId(): string {
  return `e2e-rb-${Math.random().toString(36).slice(2, 9)}`;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildRoomState(roomId: string) {
  return {
    id: roomId,
    creatorId: "e2e-user",
    name: "E2E ReferatBingo Room",
    maxPlayersPerTeam: 1,
    games: [REFERATBINGO_GAME],
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

// ── Test suite ─────────────────────────────────────────────────────────────────

authTest.describe("ReferatBingo – Spielablauf", () => {
  /**
   * Requirement 7.2 + 7.1 (baseline): The game mounts with the correct
   * data-game attribute and no uncaught JS errors.
   *
   * This doubles as the baseline smoke test for the stub implementation and
   * will continue to pass once the full game is implemented.
   */
  authTest(
    "game-area enthält data-game=\"referatBingo\" ohne JS-Fehler",
    async ({ authenticatedContext }) => {
      const mockServer = await startPartykitMock(1992).catch(() => {
        throw new Error(
          "PartyKit mock failed to start on port 1992 – port may already be in use"
        );
      });

      const gameshowRes = await authenticatedContext.request.post(
        "/api/trpc/gameshows.create",
        {
          data: {
            json: {
              name: "E2E ReferatBingo Gameshow",
              games: [REFERATBINGO_GAME]
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
      const roomState = buildRoomState(roomId);

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

      const page = await authenticatedContext.newPage();

      const pageErrors: Error[] = [];
      page.on("pageerror", (err) => pageErrors.push(err));

      const consoleErrors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") consoleErrors.push(msg.text());
      });

      try {
        const roomPage = new RoomPage(page);
        await roomPage.goto(roomId);
        await roomPage.waitForRoomLoaded();

        // Activate the game via ModPanel
        await roomPage.openModPanel();
        await roomPage.activateGameByName("Referat Bingo");
        await roomPage.waitForActiveGameIndicator("Referat Bingo", 3000);
        await page.keyboard.press("Escape");

        // Requirement 7.2: game area must contain data-game="referatBingo"
        const gameArea = page.locator('[data-testid="game-area"]');
        await expect(gameArea).toBeVisible({ timeout: 5000 });
        await expect(
          gameArea.locator('[data-game="referatBingo"]')
        ).toBeVisible({ timeout: 3000 });

        // Requirements 7.1 / 7.5: no uncaught exceptions or console errors
        expect(
          pageErrors,
          `Uncaught page errors: ${pageErrors.map((e) => e.message).join(", ")}`
        ).toHaveLength(0);
        expect(
          consoleErrors,
          `Console errors: ${consoleErrors.join(", ")}`
        ).toHaveLength(0);
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
    }
  );

  /**
   * Requirement 13.1: A Bingo grid (notefields with answers) is rendered for
   * each participating team within 3 seconds.
   *
   * FIXME: ReferatBingoGame.tsx is a stub – it does not render a grid yet.
   * Activate this test once the game renders per-team bingo grids.
   * The expected selector is `[data-testid="bingo-grid-teamOne"]` and
   * `[data-testid="bingo-grid-teamTwo"]`, each containing 9 cells.
   */
  authTest.fixme(
    "Requirement 13.1 – Bingo-Grid für jedes Team sichtbar innerhalb 3 s",
    async ({ authenticatedContext }) => {
      const mockServer = await startPartykitMock(1992).catch(() => {
        throw new Error(
          "PartyKit mock failed to start on port 1992 – port may already be in use"
        );
      });

      const gameshowRes = await authenticatedContext.request.post(
        "/api/trpc/gameshows.create",
        {
          data: {
            json: {
              name: "E2E ReferatBingo Grid Gameshow",
              games: [REFERATBINGO_GAME]
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
      const roomState = buildRoomState(roomId);

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

      const page = await authenticatedContext.newPage();

      try {
        const roomPage = new RoomPage(page);
        await roomPage.goto(roomId);
        await roomPage.waitForRoomLoaded();

        await roomPage.openModPanel();
        await roomPage.activateGameByName("Referat Bingo");
        await roomPage.waitForActiveGameIndicator("Referat Bingo", 3000);
        await page.keyboard.press("Escape");

        const gameArea = page.locator('[data-testid="game-area"]');
        const referatBingoArea = gameArea.locator('[data-game="referatBingo"]');
        await expect(referatBingoArea).toBeVisible({ timeout: 3000 });

        // Both team grids must be visible within 3 s (Requirement 13.1)
        await expect(
          referatBingoArea.locator('[data-testid="bingo-grid-teamOne"]')
        ).toBeVisible({ timeout: 3000 });
        await expect(
          referatBingoArea.locator('[data-testid="bingo-grid-teamTwo"]')
        ).toBeVisible({ timeout: 3000 });

        // Each grid has 9 cells (3x3 bingo board)
        await expect(
          referatBingoArea
            .locator('[data-testid="bingo-grid-teamOne"]')
            .locator('[data-testid^="bingo-cell"]')
        ).toHaveCount(9, { timeout: 3000 });
        await expect(
          referatBingoArea
            .locator('[data-testid="bingo-grid-teamTwo"]')
            .locator('[data-testid^="bingo-cell"]')
        ).toHaveCount(9, { timeout: 3000 });
      } finally {
        await page.close();
        await authenticatedContext.request
          .post("/api/trpc/rooms.removeActiveRoom", {
            data: { json: { roomId } },
            headers: { "Content-Type": "application/json" }
          })
          .catch(() => {});
        await authenticatedContext.request
          .post("/api/trpc/gameshows.delete", {
            data: { json: { gameshowId } },
            headers: { "Content-Type": "application/json" }
          })
          .catch(() => {});
        await mockServer.close().catch(() => {});
      }
    }
  );

  /**
   * Requirement 13.2: A player can click a cell to mark a term, adding its
   * index to `selectedAnswers`, and the cell is visually highlighted within 2 s.
   *
   * FIXME: ReferatBingoGame.tsx is a stub – no bingo cells exist to click.
   * Activate this test once the game renders interactive bingo cells.
   * Expected: clicking `[data-testid="bingo-cell-0"]` adds a selected / active
   * CSS class (e.g. `bingo-cell--selected`) to the cell within 2 s.
   */
  authTest.fixme(
    "Requirement 13.2 – Zelle markieren fügt selectedAnswers hinzu und hebt Zelle hervor",
    async ({ authenticatedContext }) => {
      const mockServer = await startPartykitMock(1992).catch(() => {
        throw new Error(
          "PartyKit mock failed to start on port 1992 – port may already be in use"
        );
      });

      const gameshowRes = await authenticatedContext.request.post(
        "/api/trpc/gameshows.create",
        {
          data: {
            json: {
              name: "E2E ReferatBingo Cell Gameshow",
              games: [REFERATBINGO_GAME]
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
      const roomState = buildRoomState(roomId);

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

      const page = await authenticatedContext.newPage();

      try {
        const roomPage = new RoomPage(page);
        await roomPage.goto(roomId);
        await roomPage.waitForRoomLoaded();

        await roomPage.openModPanel();
        await roomPage.activateGameByName("Referat Bingo");
        await roomPage.waitForActiveGameIndicator("Referat Bingo", 3000);
        await page.keyboard.press("Escape");

        const gameArea = page.locator('[data-testid="game-area"]');
        const referatBingoArea = gameArea.locator('[data-game="referatBingo"]');
        await expect(referatBingoArea).toBeVisible({ timeout: 3000 });

        // Click the first cell in teamOne's grid (index 0 = "CO2")
        const firstCell = referatBingoArea
          .locator('[data-testid="bingo-grid-teamOne"]')
          .locator('[data-testid="bingo-cell-0"]');
        await expect(firstCell).toBeVisible({ timeout: 3000 });
        await firstCell.click();

        // Requirement 13.2: cell is visually highlighted within 2 s
        // The cell should gain a selected/active class after clicking
        await expect(firstCell).toHaveClass(/bingo-cell--selected/, {
          timeout: 2000
        });

        // Requirement 7.3: the primary game action (clicking a cell) must
        // produce a DOM-observable change within 2 s – verified above via the
        // class change on the cell element.
      } finally {
        await page.close();
        await authenticatedContext.request
          .post("/api/trpc/rooms.removeActiveRoom", {
            data: { json: { roomId } },
            headers: { "Content-Type": "application/json" }
          })
          .catch(() => {});
        await authenticatedContext.request
          .post("/api/trpc/gameshows.delete", {
            data: { json: { gameshowId } },
            headers: { "Content-Type": "application/json" }
          })
          .catch(() => {});
        await mockServer.close().catch(() => {});
      }
    }
  );

  /**
   * Requirement 13.3 (implied by game design): When all answers for a team are
   * selected, a win notification is displayed in the UI within 3 seconds.
   *
   * FIXME: ReferatBingoGame.tsx is a stub – cannot test win state yet.
   * Activate this test once the game component handles the win condition.
   * Expected: after selecting all 9 cells, a notification or element with
   * text matching /bingo/i or a `data-testid="win-notification"` becomes visible.
   */
  authTest.fixme(
    "Requirement 13.3 – Alle Antworten markiert zeigt Win-Benachrichtigung innerhalb 3 s",
    async ({ authenticatedContext }) => {
      // Implementation pending full ReferatBingoGame.tsx
      // Once implemented, select all 9 cells and assert win notification visibility.
    }
  );
});
