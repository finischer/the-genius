import { expect, test } from "@e2e/fixtures";
import { trackBrowserErrors } from "@e2e/helpers/browserErrors";
import { RoomPage } from "@e2e/pages/RoomPage";

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

test.describe("ZehnSetzen – Spielablauf", () => {
  test("Requirement 15.1 – Frage-Text und Antwortfelder sichtbar", async ({
    workerSession,
    seedRoom
  }) => {
    const browserErrors = trackBrowserErrors(workerSession);
    const { roomId } = await seedRoom([ZEHN_SETZEN_GAME]);
    const roomPage = new RoomPage(workerSession);

    await roomPage.goto(roomId);
    await roomPage.waitForRoomLoaded();
    await roomPage.startGame("Zehn Setzen");

    const game = roomPage.game("zehn-setzen");
    await expect(game).toBeVisible();
    await expect(
      game.getByText("Was ist die Hauptstadt von Deutschland?")
    ).toBeVisible();
    for (const answer of ["München", "Berlin", "Hamburg", "Frankfurt"]) {
      await expect(game.getByText(answer)).toBeVisible();
    }
    await expect(
      game.getByRole("button", { name: "Lösung anzeigen" })
    ).toBeVisible();

    expect(browserErrors.errors, browserErrors.format()).toHaveLength(0);
  });

  test("Requirement 15.2 – Beide Teams submitted: 'X hat eingeloggt' sichtbar", async ({
    workerSession,
    seedRoom
  }) => {
    const browserErrors = trackBrowserErrors(workerSession);
    const { roomId } = await seedRoom([ZEHN_SETZEN_GAME_SUBMITTED], {
      teamOneName: "Die Adler",
      teamTwoName: "Die Löwen"
    });
    const roomPage = new RoomPage(workerSession);

    await roomPage.goto(roomId);
    await roomPage.waitForRoomLoaded();
    await roomPage.startGame("Zehn Setzen");

    const game = roomPage.game("zehn-setzen");
    await expect(game.getByText("Die Adler hat eingeloggt")).toBeVisible();
    await expect(game.getByText("Die Löwen hat eingeloggt")).toBeVisible();

    expect(browserErrors.errors, browserErrors.format()).toHaveLength(0);
  });

  test("Requirement 15.3 – Lösung anzeigen hebt korrekte Antwort hervor und vergibt Punkte", async ({
    workerSession,
    seedRoom
  }) => {
    const browserErrors = trackBrowserErrors(workerSession);
    const { roomId } = await seedRoom([ZEHN_SETZEN_GAME_SUBMITTED], {
      teamOneName: "Die Falken",
      teamTwoName: "Die Wölfe"
    });
    const roomPage = new RoomPage(workerSession);

    await roomPage.goto(roomId);
    await roomPage.waitForRoomLoaded();
    await roomPage.startGame("Zehn Setzen");

    const game = roomPage.game("zehn-setzen");
    await expect(game.getByText("Die Falken hat eingeloggt")).toBeVisible();
    await expect(game.getByText("Die Wölfe hat eingeloggt")).toBeVisible();

    const berlin = game.getByTestId("zehn-setzen-answer-2");
    await expect(berlin).toHaveAttribute("data-correct", "false");

    await game.getByRole("button", { name: "Lösung anzeigen" }).click();

    await expect(
      game.getByRole("button", { name: "Lösung ausblenden" })
    ).toBeVisible();
    await expect(berlin).toHaveAttribute("data-correct", "true");
    await expect(roomPage.teamOne.score).toHaveAttribute("data-score", "10");
    await expect(roomPage.teamTwo.score).toHaveAttribute("data-score", "10");

    expect(browserErrors.errors, browserErrors.format()).toHaveLength(0);
  });
});
