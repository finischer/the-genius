import * as Y from "yjs";
import { syncedStore, getYjsValue } from "@syncedstore/core";
import { test } from "../../fixtures/auth";
import { expect } from "@playwright/test";
import { startPartykitMock } from "../../helpers/partykit-mock";
import { RoomPage } from "../../pages/RoomPage";

// ── DuSagst game fixture data ─────────────────────────────────────────────────

const DUSAGST_GAME = {
  identifier: "duSagst",
  name: "Du Sagst...",
  maxPoints: 6,
  scorebarMode: "circle",
  modes: ["TEAM"],
  qIndex: 0,
  questions: [
    {
      id: "q1",
      question: "Was ist die Hauptstadt von Frankreich?",
      answers: [
        { id: "a1", text: "Paris" },
        { id: "a2", text: "Lyon" },
        { id: "a3", text: "Marseille" },
        { id: "a4", text: "Bordeaux" }
      ]
    },
    {
      id: "q2",
      question: "Wie viele Planeten hat unser Sonnensystem?",
      answers: [
        { id: "b1", text: "7" },
        { id: "b2", text: "8" },
        { id: "b3", text: "9" },
        { id: "b4", text: "10" }
      ]
    }
  ],
  timeToThinkSeconds: 30,
  timer: { id: null, active: false, currSeconds: 0, initSeconds: 30 },
  teamStates: {
    t1: {
      id: "ts1",
      boxStates: [
        {
          id: "bs1",
          answerIndex: -1,
          answerTheQuestion: true,
          showAnswer: false,
          submitted: true
        },
        {
          id: "bs2",
          answerIndex: -1,
          answerTheQuestion: false,
          showAnswer: false,
          submitted: true
        }
      ]
    },
    t2: {
      id: "ts2",
      boxStates: [
        {
          id: "bs3",
          answerIndex: -1,
          answerTheQuestion: true,
          showAnswer: false,
          submitted: true
        },
        {
          id: "bs4",
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
};

function generateRoomId(): string {
  return `e2e-ds-${Math.random().toString(36).slice(2, 9)}`;
}

// ── Test suite ────────────────────────────────────────────────────────────────

/**
 * Task 11.2 – Requirements 7.3, 8.1, 8.2, 8.3
 *
 * Verifies the DuSagst game flow:
 *  - Question text and answer options visible within 3 s of game activation (8.1)
 *  - Score +1 (the moderator "Richtig" action) increments gameScore visible in UI
 *    within 2 s (8.2)
 *  - "Weiter" advances qIndex and shows a different question text within 2 s (8.3)
 *  - DOM-observable change on the game element within 2 s (7.3)
 */
test.describe("DuSagst – Spielablauf", () => {
  test("Frage sichtbar, Score +1 erhöht gameScore, Weiter zeigt neue Frage", async ({
    authenticatedContext
  }) => {
    const mockServer = await startPartykitMock(1998).catch(() => {
      throw new Error(
        "PartyKit mock failed to start on port 1998 – port may already be in use"
      );
    });

    // ── Create a Gameshow with a DuSagst game (2 questions) ──────────────────
    const gameshowRes = await authenticatedContext.request.post(
      "/api/trpc/gameshows.create",
      {
        data: { json: { name: "E2E DuSagst Gameshow", games: [DUSAGST_GAME] } },
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

    // ── Build and seed the room Yjs state ─────────────────────────────────────
    const roomState = {
      id: roomId,
      creatorId: "e2e-user",
      name: "E2E DuSagst Room",
      maxPlayersPerTeam: 1,
      games: [DUSAGST_GAME],
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

    // ── Run the test ──────────────────────────────────────────────────────────
    const page = await authenticatedContext.newPage();
    const roomPage = new RoomPage(page);

    try {
      await roomPage.goto(roomId);
      await roomPage.waitForRoomLoaded();

      // ── Activate the DuSagst game via ModPanel ────────────────────────────
      await roomPage.openModPanel();
      await roomPage.expandStartGameAccordion();

      const gamePanel = page.locator(
        ".mod-panel-start-games-accordion .mantine-Accordion-panel"
      );
      const duSagstBtn = gamePanel
        .locator(".mantine-Button-root", { hasText: "Du Sagst" })
        .first();
      await expect(duSagstBtn).toBeVisible({ timeout: 3000 });
      await duSagstBtn.click();

      // Wait for the active-game indicator to confirm the game started
      await expect(
        gamePanel
          .locator(".mantine-Button-root", { hasText: "Du Sagst" })
          .filter({ hasText: "(Läuft gerade)" })
      ).toBeVisible({ timeout: 3000 });

      // Close the ModPanel
      await page.keyboard.press("Escape");

      // ── Requirement 7.2 / 7.3: game-area contains [data-game="duSagst"] ──
      const gameArea = page.locator('[data-testid="game-area"]');
      await expect(gameArea).toBeVisible({ timeout: 5000 });
      const duSagstArea = gameArea.locator('[data-game="duSagst"]');
      await expect(duSagstArea).toBeVisible({ timeout: 3000 });

      // ── Requirement 8.1: question text and at least one answer visible ─────
      // The moderator always sees the QuestionContainer content (via ModToggle).
      await expect(
        page.locator("text=Was ist die Hauptstadt von Frankreich?")
      ).toBeVisible({ timeout: 3000 });

      // At least one answer option rendered
      await expect(page.locator("text=Paris")).toBeVisible({
        timeout: 3000
      });

      // ── Requirement 8.2: Score +1 increments gameScore visibly within 2 s ──
      // The Score +1 button is the ActionIcon with toolTip="Score +1" inside
      // the Scorebar for teamOne. It is wrapped in ModView (host/moderator only).
      //
      // Structure inside [data-testid="scorebar-teamOne"]:
      //   scorebar-settings Group > ActionIcon (target) > ActionIcon (-1) > ActionIcon (+1)
      //
      // The ActionIcon buttons render as <button> elements. We locate them via the
      // .scorebar-settings Group and pick by position: 0=toggle-turn, 1=minus, 2=plus.
      const scorebarOne = page.locator('[data-testid="scorebar-teamOne"]');
      const scoreSettings = scorebarOne.locator(".scorebar-settings");
      await expect(scoreSettings).toBeVisible({ timeout: 3000 });

      // The +1 button is the 3rd button (index 2) in .scorebar-settings
      const increaseBtn = scoreSettings.locator("button").nth(2);
      await expect(increaseBtn).toBeVisible({ timeout: 3000 });
      await expect(increaseBtn).not.toBeDisabled({ timeout: 2000 });

      await increaseBtn.click();

      // After clicking +1, at least one ScoreCircle should become filled.
      // ScoreCircle renders a Box with background = colors.success when filled.
      // We verify a DOM change: a child element with a non-transparent background
      // appears in the score display area.
      // The scorebar renders scorebarPoints inside a Flex; when scorebarMode="circle"
      // the circles are rendered. The filled circle will have a background-color
      // different from "transparent".
      //
      // Most reliable: check that the scorebar now contains a filled circle element.
      // The ScoreCircle Box has inline style "background: <success-color>".
      await expect
        .poll(
          async () => {
            const circles = await scorebarOne
              .locator("[style*='border-radius: 50%']")
              .evaluateAll((els) =>
                els.map((el) => window.getComputedStyle(el).background)
              );
            return circles.some(
              (bg) => !bg.includes("rgba(0, 0, 0, 0)") && !bg.includes("transparent")
            );
          },
          { timeout: 2000 }
        )
        .toBeTruthy();

      // ── Requirement 8.3: "Weiter" advances qIndex, new question text shown ─
      // Record first question visible
      const firstQuestionLocator = page.locator(
        "text=Was ist die Hauptstadt von Frankreich?"
      );
      await expect(firstQuestionLocator).toBeVisible({ timeout: 1000 });

      // Click "Weiter" in GameNavControls (wrapped in ModView → host sees it)
      const weiterBtn = page.locator("button", { hasText: "Weiter" }).first();
      await expect(weiterBtn).toBeVisible({ timeout: 2000 });
      await expect(weiterBtn).not.toBeDisabled({ timeout: 1000 });
      await weiterBtn.click();

      // Second question must appear within 2 s
      await expect(
        page.locator("text=Wie viele Planeten hat unser Sonnensystem?")
      ).toBeVisible({ timeout: 2000 });

      // First question must no longer be visible (qIndex changed)
      await expect(firstQuestionLocator).not.toBeVisible({ timeout: 2000 });
    } finally {
      await page.close();

      // ── Cleanup ─────────────────────────────────────────────────────────────
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
