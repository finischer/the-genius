import * as Y from "yjs";
import { syncedStore, getYjsValue } from "@syncedstore/core";
import { test as authTest } from "../../fixtures/auth";
import { startPartykitMock } from "../../helpers/partykit-mock";
import { expect } from "@playwright/test";
import { RoomPage } from "../../pages/RoomPage";

// ── Fragenhagel game seed ────────────────────────────────────────────────────

const FRAGENHAGEL_GAME = {
  identifier: "fragenhagel",
  name: "Fragenhagel",
  maxPoints: 20,
  scorebarMode: "number",
  modes: ["DUELL"],
  questions: [
    { id: "q1", question: "Was ist die Hauptstadt von Deutschland?", answer: "Berlin" },
    { id: "q2", question: "Wie viele Bundesländer hat Deutschland?", answer: "16" },
    { id: "q3", question: "Welches Tier ist das Wappentier Deutschlands?", answer: "Adler" }
  ],
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
};

// ── Fixture ──────────────────────────────────────────────────────────────────

type FragenhagelFixtures = {
  fragenhagelContext: {
    gameshowId: string;
    roomId: string;
    roomUrl: string;
  };
};

function generateRoomId(): string {
  return `e2e-fh-${Math.random().toString(36).slice(2, 10)}`;
}

function buildRoomState(roomId: string, game: typeof FRAGENHAGEL_GAME) {
  return {
    id: roomId,
    creatorId: "e2e-user",
    name: "E2E Fragenhagel Room",
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

const test = authTest.extend<FragenhagelFixtures>({
  fragenhagelContext: async ({ authenticatedContext }, use) => {
    const mockServer = await startPartykitMock(1998).catch(() => {
      throw new Error(
        "PartyKit mock failed to start on port 1998 – port may already be in use"
      );
    });

    const gameshowRes = await authenticatedContext.request.post(
      "/api/trpc/gameshows.create",
      {
        data: {
          json: {
            name: "E2E Fragenhagel Gameshow",
            games: [FRAGENHAGEL_GAME]
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
    const roomState = buildRoomState(roomId, FRAGENHAGEL_GAME);

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

// ── Helper: activate the Fragenhagel game via the ModPanel ───────────────────

async function activateFragenhagel(page: import("@playwright/test").Page) {
  const roomPage = new RoomPage(page);
  await roomPage.waitForRoomLoaded();
  await roomPage.openModPanel();
  await roomPage.expandStartGameAccordion();

  const panel = page.locator(
    ".mod-panel-start-games-accordion .mantine-Accordion-panel"
  );
  // Click the Fragenhagel game button specifically
  const fragenhagelBtn = panel
    .locator(".mantine-ButtonGroup")
    .filter({ hasText: /fragenhagel/i })
    .locator(".mantine-Button-root")
    .first();

  await fragenhagelBtn.click();

  // Wait for the game area to show the fragenhagel component
  await expect(
    page.locator('[data-testid="game-area"] [data-game="fragenhagel"]')
  ).toBeVisible({ timeout: 3000 });
}

// ── Tests ────────────────────────────────────────────────────────────────────

test.describe("Fragenhagel – Timer und Scoring", () => {
  // Requirements 7.3, 10.1 – Fragenhagel aktiv: Frage-Text und Timer sichtbar
  test("Frage-Text und Timer-Sekunden sichtbar nach Spielstart", async ({
    authenticatedContext,
    fragenhagelContext
  }) => {
    const page = await authenticatedContext.newPage();

    try {
      await page.goto(fragenhagelContext.roomUrl);
      await activateFragenhagel(page);

      const gameArea = page.locator(
        '[data-testid="game-area"] [data-game="fragenhagel"]'
      );

      // Requirement 10.1: question text visible within 3 seconds
      await expect(
        gameArea.getByText(
          "Was ist die Hauptstadt von Deutschland?",
          { exact: false }
        )
      ).toBeVisible({ timeout: 3000 });

      // Timer seconds element is visible (starts at 0)
      const timerText = gameArea.locator('[class*="timerText"]');
      await expect(timerText).toBeVisible({ timeout: 3000 });

      // Start the timer via the "Starten" button (ModView, only visible for host)
      await page
        .getByRole("button", { name: "Starten" })
        .click({ timeout: 3000 });

      // Timer should now be active — wait for seconds to increment from 0
      // (Requirement 10.1: incrementing seconds counter visible)
      await expect
        .poll(
          async () => {
            const text = await timerText.innerText().catch(() => "0");
            return parseInt(text.trim(), 10);
          },
          { timeout: 5000, intervals: [500] }
        )
        .toBeGreaterThan(0);
    } finally {
      await page.close();
    }
  });

  // Requirement 10.2 – Timer stoppen: timerState.isActive = false, Zeit sichtbar
  test("Timer stoppen friert den Zähler ein", async ({
    authenticatedContext,
    fragenhagelContext
  }) => {
    const page = await authenticatedContext.newPage();

    try {
      await page.goto(fragenhagelContext.roomUrl);
      await activateFragenhagel(page);

      const gameArea = page.locator(
        '[data-testid="game-area"] [data-game="fragenhagel"]'
      );
      const timerText = gameArea.locator('[class*="timerText"]');

      // Start timer
      await page
        .getByRole("button", { name: "Starten" })
        .click({ timeout: 3000 });

      // Wait for the timer to tick at least once
      await expect
        .poll(
          async () => {
            const text = await timerText.innerText().catch(() => "0");
            return parseInt(text.trim(), 10);
          },
          { timeout: 5000, intervals: [500] }
        )
        .toBeGreaterThan(0);

      // Record the seconds value, then stop the timer
      const secondsAtStop =
        parseInt((await timerText.innerText()).trim(), 10);

      await page
        .getByRole("button", { name: "Stoppen" })
        .click({ timeout: 2000 });

      // Requirement 10.2: timer stopped — value must not advance further.
      // Wait 1.5 seconds and assert the displayed value is the same (or
      // the "Stoppen" button becomes disabled, indicating isActive = false).
      await page.waitForTimeout(1500);
      const secondsAfterStop =
        parseInt((await timerText.innerText()).trim(), 10);

      expect(secondsAfterStop).toBeLessThanOrEqual(secondsAtStop + 1);

      // Additionally verify the "Stoppen" button is now disabled (isActive = false)
      await expect(
        page.getByRole("button", { name: "Stoppen" })
      ).toBeDisabled({ timeout: 2000 });

      // Elapsed time value should be visible and non-negative
      expect(secondsAfterStop).toBeGreaterThanOrEqual(0);
    } finally {
      await page.close();
    }
  });

  // Requirement 10.3 – Richtig/Falsch: currentScore aktualisiert sich
  test("Richtig-Button erhöht den aktuellen Score", async ({
    authenticatedContext,
    fragenhagelContext
  }) => {
    const page = await authenticatedContext.newPage();

    try {
      await page.goto(fragenhagelContext.roomUrl);
      await activateFragenhagel(page);

      const gameArea = page.locator(
        '[data-testid="game-area"] [data-game="fragenhagel"]'
      );

      // ScoreBox starts at 0
      const scoreBox = gameArea.locator('[class*="scoreText"]');
      await expect(scoreBox).toBeVisible({ timeout: 3000 });
      await expect(scoreBox).toHaveText("0", { timeout: 2000 });

      // Click "Richtig" — score should increment to 1 (Requirement 10.3)
      await page
        .getByRole("button", { name: "Richtig" })
        .click({ timeout: 2000 });

      await expect(scoreBox).toHaveText("1", { timeout: 2000 });
    } finally {
      await page.close();
    }
  });

  // Requirement 10.3 – Falsch-Button: currentScore bleibt unverändert
  test("Falsch-Button lässt den Score unverändert", async ({
    authenticatedContext,
    fragenhagelContext
  }) => {
    const page = await authenticatedContext.newPage();

    try {
      await page.goto(fragenhagelContext.roomUrl);
      await activateFragenhagel(page);

      const gameArea = page.locator(
        '[data-testid="game-area"] [data-game="fragenhagel"]'
      );

      const scoreBox = gameArea.locator('[class*="scoreText"]');
      await expect(scoreBox).toBeVisible({ timeout: 3000 });
      await expect(scoreBox).toHaveText("0", { timeout: 2000 });

      // Click "Falsch" — score must remain 0 (Requirement 10.3)
      await page
        .getByRole("button", { name: "Falsch" })
        .click({ timeout: 2000 });

      await expect(scoreBox).toHaveText("0", { timeout: 2000 });
    } finally {
      await page.close();
    }
  });
});
