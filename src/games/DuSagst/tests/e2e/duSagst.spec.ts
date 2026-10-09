import { expect, test } from "@e2e/fixtures";
import { RoomPage } from "@e2e/pages/RoomPage";

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

test.describe("DuSagst – Spielablauf", () => {
  test("Frage sichtbar, Score +1 erhöht gameScore, Weiter zeigt neue Frage", async ({
    workerSession,
    seedRoom
  }) => {
    const { roomId } = await seedRoom([DUSAGST_GAME]);
    const roomPage = new RoomPage(workerSession);

    await roomPage.goto(roomId);
    await roomPage.waitForRoomLoaded();
    await roomPage.startGame("Du Sagst");

    const game = roomPage.game("du-sagst");
    const firstQuestion = game.getByText(
      "Was ist die Hauptstadt von Frankreich?"
    );
    await expect(game).toBeVisible();
    await expect(firstQuestion).toBeVisible();
    await expect(game.getByText("Paris")).toBeVisible();

    await expect(roomPage.teamOne.score).toHaveAttribute("data-score", "0");
    await roomPage.teamOne.increment();
    await expect(roomPage.teamOne.score).toHaveAttribute("data-score", "1");

    await game.getByRole("button", { name: "Weiter" }).click();

    await expect(
      game.getByText("Wie viele Planeten hat unser Sonnensystem?")
    ).toBeVisible();
    await expect(firstQuestion).toBeHidden();
  });
});
