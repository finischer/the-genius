import * as Y from "yjs";
import { syncedStore, getYjsValue } from "@syncedstore/core";
import { test } from "../../fixtures/auth";
import { expect } from "@playwright/test";
import { startPartykitMock } from "../../helpers/partykit-mock";
import { RoomPage } from "../../pages/RoomPage";

// ── ZehnSetzen game fixture data ──────────────────────────────────────────────

const CORRECT_ANSWER = { id: "ans-b", answer: "Berlin" };

const ZEHN_SETZEN_GAME = {
  identifier: "zehnSetzen",
  name: "Zehn Setzen",
  maxPoints: 10,
  scorebarMode: "number",
  modes: ["DUELL", "TEAM"],
  qIndex: 0,
  questions: [
    {
      id: "q1",
      question: "Was ist die Hauptstadt von Deutschland?",
      answers: [
        { id: "ans-a", answer: "München" },
        { id: "ans-b", answer: "Berlin" },
        { id: "ans-c", answer: "Hamburg" },
        { id: "ans-d", answer: "Frankfurt" }
      ],
      correctAnswer: CORRECT_ANSWER
    }
  ],
  teamStates: {
    t1: {
      id: "t1",
      answerScores: [0, 0, 0, 0],
      submitted: false
    },
    t2: {
      id: "t2",
      answerScores: [0, 0, 0, 0],
      submitted: false
    }
  },
  display: {
    question: true,
    answers: [0, 1, 2, 3],
    correctAnswer: false,
    teamScores: { t1: false, t2: false }
  },
  rules: ""
};

// Same game but with both teams having submitted (all 10 points placed on answer B)
const ZEHN_SETZEN_GAME_SUBMITTED = {
  ...ZEHN_SETZEN_GAME,
  teamStates: {
    t1: {
      id: "t1",
      answerScores: [0, 10, 0, 0],
      submitted: true
    },
    t2: {
      id: "t2",
      answerScores: [0, 10, 0, 0],
      submitted: true
    }
  }
};

function generateRoomId(suffix: string): string {
  return `e2e-zs-${suffix}-${Math.random().toString(36).slice(2, 7)}`;
}

function buildRoomState(
  roomId: string,
  game: typeof ZEHN_SETZEN_GAME,
  teamOneName = "Team 1",
  teamTwoName = "Team 2"
) {
  return {
    id: roomId,
    creatorId: "e2e-user",
    name: "E2E ZehnSetzen Room",
    maxPlayersPerTeam: 1,
    games: [game],
    teams: {
      teamOne: {
        id: "t1",
        name: teamOneName,
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
        name: teamTwoName,
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

async function createRoomFixture(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  authenticatedContext: any,
  game: typeof ZEHN_SETZEN_GAME,
  mockServer: Awaited<ReturnType<typeof startPartykitMock>>,
  teamOneName?: string,
  teamTwoName?: string
) {
  const gameshowRes = await authenticatedContext.request.post(
    "/api/trpc/gameshows.create",
    {
      data: { json: { name: "E2E ZehnSetzen Gameshow", games: [game] } },
      headers: { "Content-Type": "application/json" }
    }
  );
  if (!gameshowRes.ok()) {
    throw new Error(`Gameshow creation failed: ${gameshowRes.status()}`);
  }
  const gameshowData = (await gameshowRes.json()) as {
    result: { data: { json: { id: string } } };
  };
  const gameshowId = gameshowData.result.data.json.id;

  const roomId = generateRoomId("setup");
  const roomState = buildRoomState(roomId, game, teamOneName, teamTwoName);

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
    throw new Error(`Room creation failed: ${roomRes.status()}`);
  }

  return { gameshowId, roomId };
}

async function cleanup(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  authenticatedContext: any,
  roomId: string,
  gameshowId: string,
  mockServer: Awaited<ReturnType<typeof startPartykitMock>>
) {
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

// ── Test suite ────────────────────────────────────────────────────────────────

/**
 * Task 11.9 – Requirements 7.3, 15.1, 15.2, 15.3
 *
 * Verifies the ZehnSetzen game flow:
 *  - Frage-Text und Eingabefelder sichtbar innerhalb 3 s (15.1)
 *  - Beide Teams haben submitted = true, UI zeigt "X hat eingeloggt" für beide (15.2)
 *  - Moderator revealed Antwort: korrekte Antwort grün hervorgehoben (15.3)
 */
test.describe("ZehnSetzen – Spielablauf", () => {
  // ── 15.1 ──────────────────────────────────────────────────────────────────
  test("Requirement 15.1 – Frage-Text und Antwortfelder sichtbar innerhalb 3 Sekunden", async ({
    authenticatedContext
  }) => {
    const mockServer = await startPartykitMock(1990).catch(() => {
      throw new Error(
        "PartyKit mock failed to start on port 1990 – port may already be in use"
      );
    });

    const { gameshowId, roomId } = await createRoomFixture(
      authenticatedContext,
      ZEHN_SETZEN_GAME,
      mockServer
    );

    const page = await authenticatedContext.newPage();
    const roomPage = new RoomPage(page);

    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    try {
      await roomPage.goto(roomId);
      await roomPage.waitForRoomLoaded();

      // ── Activate ZehnSetzen via ModPanel ────────────────────────────────
      await roomPage.openModPanel();
      await roomPage.expandStartGameAccordion();

      const gamePanel = page.locator(
        ".mod-panel-start-games-accordion .mantine-Accordion-panel"
      );
      const zehnSetzenBtn = gamePanel
        .locator(".mantine-Button-root", { hasText: "Zehn Setzen" })
        .first();
      await expect(zehnSetzenBtn).toBeVisible({ timeout: 3000 });
      await zehnSetzenBtn.click();

      // Wait for active-game indicator (Requirement 5.3)
      await expect(
        gamePanel
          .locator(".mantine-Button-root", { hasText: "Zehn Setzen" })
          .filter({ hasText: "(Läuft gerade)" })
      ).toBeVisible({ timeout: 3000 });

      // Close ModPanel to see the game area
      await page.keyboard.press("Escape");

      // ── Requirement 7.2: game area contains data-game="zehnSetzen" ────────
      const gameArea = page.locator('[data-testid="game-area"]');
      await expect(gameArea).toBeVisible({ timeout: 5000 });
      const zehnSetzenArea = gameArea.locator('[data-game="zehnSetzen"]');
      await expect(zehnSetzenArea).toBeVisible({ timeout: 3000 });

      // ── Requirement 15.1: question text visible within 3 s ────────────────
      // The host always sees the QuestionBox text regardless of display.question
      await expect(
        page.locator("text=Was ist die Hauptstadt von Deutschland?")
      ).toBeVisible({ timeout: 3000 });

      // ── Requirement 15.1: answer fields (QuestionBox per answer) visible ──
      // display.answers = [0,1,2,3] so all four answers are pre-shown
      await expect(
        zehnSetzenArea.locator("text=München")
      ).toBeVisible({ timeout: 3000 });
      await expect(
        zehnSetzenArea.locator("text=Berlin")
      ).toBeVisible({ timeout: 3000 });
      await expect(
        zehnSetzenArea.locator("text=Hamburg")
      ).toBeVisible({ timeout: 3000 });
      await expect(
        zehnSetzenArea.locator("text=Frankfurt")
      ).toBeVisible({ timeout: 3000 });

      // ── Requirement 7.3: DOM-observable change – game renders correctly ───
      // Verify the "Lösung anzeigen" button (mod control) is present,
      // confirming the component mounted without errors.
      await expect(
        page.locator("button", { hasText: "Lösung anzeigen" })
      ).toBeVisible({ timeout: 3000 });

      // No unhandled JS errors (Requirement 7.1)
      expect(consoleErrors).toHaveLength(0);
    } finally {
      await page.close();
      await cleanup(authenticatedContext, roomId, gameshowId, mockServer);
    }
  });

  // ── 15.2 ──────────────────────────────────────────────────────────────────
  test("Requirement 15.2 – Beide Teams submitted: 'X hat eingeloggt' für beide sichtbar", async ({
    authenticatedContext
  }) => {
    const mockServer = await startPartykitMock(1991).catch(() => {
      throw new Error(
        "PartyKit mock failed to start on port 1991 – port may already be in use"
      );
    });

    // Use distinct team names so the "X hat eingeloggt" messages are unique
    const { gameshowId, roomId } = await createRoomFixture(
      authenticatedContext,
      ZEHN_SETZEN_GAME_SUBMITTED,
      mockServer,
      "Die Adler",
      "Die Löwen"
    );

    const page = await authenticatedContext.newPage();
    const roomPage = new RoomPage(page);

    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    try {
      await roomPage.goto(roomId);
      await roomPage.waitForRoomLoaded();

      // ── Activate ZehnSetzen ──────────────────────────────────────────────
      await roomPage.openModPanel();
      await roomPage.expandStartGameAccordion();

      const gamePanel = page.locator(
        ".mod-panel-start-games-accordion .mantine-Accordion-panel"
      );
      const zehnSetzenBtn = gamePanel
        .locator(".mantine-Button-root", { hasText: "Zehn Setzen" })
        .first();
      await expect(zehnSetzenBtn).toBeVisible({ timeout: 3000 });
      await zehnSetzenBtn.click();

      await expect(
        gamePanel
          .locator(".mantine-Button-root", { hasText: "Zehn Setzen" })
          .filter({ hasText: "(Läuft gerade)" })
      ).toBeVisible({ timeout: 3000 });

      // Close ModPanel
      await page.keyboard.press("Escape");

      const gameArea = page.locator('[data-testid="game-area"]');
      await expect(gameArea).toBeVisible({ timeout: 5000 });
      const zehnSetzenArea = gameArea.locator('[data-game="zehnSetzen"]');
      await expect(zehnSetzenArea).toBeVisible({ timeout: 3000 });

      // ── Requirement 15.2: both submitted teams display "hat eingeloggt" ──
      // ZehnSetzenGame renders: {roomTeam.name} hat eingeloggt
      // Both teams have submitted: true in the seeded state.
      // The text is wrapped in ModView (visible to host).
      await expect(
        page.locator("text=Die Adler hat eingeloggt")
      ).toBeVisible({ timeout: 2000 });

      await expect(
        page.locator("text=Die Löwen hat eingeloggt")
      ).toBeVisible({ timeout: 2000 });

      // No unhandled JS errors
      expect(consoleErrors).toHaveLength(0);
    } finally {
      await page.close();
      await cleanup(authenticatedContext, roomId, gameshowId, mockServer);
    }
  });

  // ── 15.3 ──────────────────────────────────────────────────────────────────
  test("Requirement 15.3 – Moderator revealed Antwort: korrekte Antwort hervorgehoben", async ({
    authenticatedContext
  }) => {
    const mockServer = await startPartykitMock(1992).catch(() => {
      throw new Error(
        "PartyKit mock failed to start on port 1992 – port may already be in use"
      );
    });

    // Seed with submitted state so point-applying logic has scores to work with
    const { gameshowId, roomId } = await createRoomFixture(
      authenticatedContext,
      ZEHN_SETZEN_GAME_SUBMITTED,
      mockServer,
      "Die Falken",
      "Die Wölfe"
    );

    const page = await authenticatedContext.newPage();
    const roomPage = new RoomPage(page);

    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    try {
      await roomPage.goto(roomId);
      await roomPage.waitForRoomLoaded();

      // ── Activate ZehnSetzen ──────────────────────────────────────────────
      await roomPage.openModPanel();
      await roomPage.expandStartGameAccordion();

      const gamePanel = page.locator(
        ".mod-panel-start-games-accordion .mantine-Accordion-panel"
      );
      const zehnSetzenBtn = gamePanel
        .locator(".mantine-Button-root", { hasText: "Zehn Setzen" })
        .first();
      await expect(zehnSetzenBtn).toBeVisible({ timeout: 3000 });
      await zehnSetzenBtn.click();

      await expect(
        gamePanel
          .locator(".mantine-Button-root", { hasText: "Zehn Setzen" })
          .filter({ hasText: "(Läuft gerade)" })
      ).toBeVisible({ timeout: 3000 });

      // Close ModPanel
      await page.keyboard.press("Escape");

      const gameArea = page.locator('[data-testid="game-area"]');
      await expect(gameArea).toBeVisible({ timeout: 5000 });
      const zehnSetzenArea = gameArea.locator('[data-game="zehnSetzen"]');
      await expect(zehnSetzenArea).toBeVisible({ timeout: 3000 });

      // Confirm "Die Falken hat eingeloggt" and "Die Wölfe hat eingeloggt" visible
      // (seeded with submitted = true for both teams)
      await expect(
        page.locator("text=Die Falken hat eingeloggt")
      ).toBeVisible({ timeout: 2000 });
      await expect(
        page.locator("text=Die Wölfe hat eingeloggt")
      ).toBeVisible({ timeout: 2000 });

      // ── Requirement 15.3: click "Lösung anzeigen" to reveal correct answer ─
      const revealBtn = page.locator("button", { hasText: "Lösung anzeigen" });
      await expect(revealBtn).toBeVisible({ timeout: 3000 });
      await revealBtn.click();

      // Button label should flip to "Lösung ausblenden" after reveal
      await expect(
        page.locator("button", { hasText: "Lösung ausblenden" })
      ).toBeVisible({ timeout: 3000 });

      // ── Correct answer ("Berlin") turns green ────────────────────────────
      // AnswerElement sets bg="green" when isCorrectAnswer && display.correctAnswer.
      // Mantine's Box with bg="green" sets --mantine-color-green-filled as the
      // background, which resolves to a green rgb value at runtime.
      // We check both the inline style for a Mantine green CSS var AND the
      // computed color having a dominant green channel as a fallback.
      const berlinContainer = zehnSetzenArea
        .locator(".mantine-Box-root")
        .filter({ hasText: "Berlin" });

      await expect
        .poll(
          async () => {
            // Mantine sets inline style like: background-color: var(--mantine-color-green-filled)
            // or background: green — check data-testid or inline style
            const count = await berlinContainer.count();
            if (count === 0) return false;

            const bg = await berlinContainer
              .first()
              .evaluate((el) => window.getComputedStyle(el).backgroundColor);

            // Any green-ish rgb: green channel dominant
            const match = bg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (!match) return false;
            const [, r, g, b] = match.map(Number);
            return (g ?? 0) > (r ?? 0) && (g ?? 0) > (b ?? 0);
          },
          { timeout: 3000 }
        )
        .toBeTruthy();

      // ── Requirement 15.3: scores updated after reveal ───────────────────
      // handleToggleCorrectAnswer calls applyPointsToTeamScores after 1 s.
      // teamOne and teamTwo each put 10 on answer index 1 (Berlin).
      // So both room.teams.teamOne.gameScore and teamTwo.gameScore += 10.
      // The Scorebar renders gameScore for each team – wait for "10" to appear.
      await expect(
        page.locator('[data-testid="scorebar-teamOne"]')
      ).toContainText("10", { timeout: 3000 });

      await expect(
        page.locator('[data-testid="scorebar-teamTwo"]')
      ).toContainText("10", { timeout: 3000 });

      // No unhandled JS errors
      expect(consoleErrors).toHaveLength(0);
    } finally {
      await page.close();
      await cleanup(authenticatedContext, roomId, gameshowId, mockServer);
    }
  });
});
