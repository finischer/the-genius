import { expect, test } from "@e2e/fixtures";
import { RoomPage } from "@e2e/pages/RoomPage";

// ── Fragenhagel game seed ────────────────────────────────────────────────────

const FRAGENHAGEL_GAME = {
  identifier: "fragenhagel",
  name: "Fragenhagel",
  maxPoints: 20,
  scorebarMode: "number",
  modes: ["DUELL"],
  questions: [
    {
      id: "q1",
      question: "Was ist die Hauptstadt von Deutschland?",
      answer: "Berlin"
    },
    {
      id: "q2",
      question: "Wie viele Bundesländer hat Deutschland?",
      answer: "16"
    },
    {
      id: "q3",
      question: "Welches Tier ist das Wappentier Deutschlands?",
      answer: "Adler"
    }
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

test.describe("Fragenhagel – Timer und Scoring", () => {
  let roomPage: RoomPage;

  test.beforeEach(async ({ workerSession, seedRoom }) => {
    const { roomId } = await seedRoom([FRAGENHAGEL_GAME]);
    roomPage = new RoomPage(workerSession);
    await roomPage.goto(roomId);
    await roomPage.waitForRoomLoaded();
    await roomPage.startGame("Fragenhagel");
    await expect(roomPage.game("fragenhagel")).toBeVisible();
  });

  test("Frage-Text und Timer-Sekunden sichtbar nach Spielstart", async ({
    workerSession
  }) => {
    const game = roomPage.game("fragenhagel");
    const timer = game.getByTestId("fragenhagel-timer");

    await expect(
      game.getByText("Was ist die Hauptstadt von Deutschland?")
    ).toBeVisible();
    await expect(timer).toHaveText("0");

    await workerSession.getByRole("button", { name: "Starten" }).click();

    await expect(timer).not.toHaveText("0");
  });

  test("Timer stoppen friert den Zähler ein", async ({ workerSession }) => {
    const timer = roomPage.game("fragenhagel").getByTestId("fragenhagel-timer");
    const stopButton = workerSession.getByRole("button", { name: "Stoppen" });

    await workerSession.getByRole("button", { name: "Starten" }).click();
    await expect(timer).not.toHaveText("0");

    await stopButton.click();
    await expect(stopButton).toBeDisabled();

    const frozenValue = (await timer.innerText()).trim();
    await expect(timer).toHaveText(frozenValue);
  });

  test("Richtig-Button erhöht den aktuellen Score", async ({
    workerSession
  }) => {
    const score = roomPage.game("fragenhagel").getByTestId("fragenhagel-score");
    await expect(score).toHaveText("0");

    await workerSession.getByRole("button", { name: "Richtig" }).click();

    await expect(score).toHaveText("1");
  });

  test("Falsch-Button lässt den Score unverändert", async ({
    workerSession
  }) => {
    const score = roomPage.game("fragenhagel").getByTestId("fragenhagel-score");
    await expect(score).toHaveText("0");

    await workerSession.getByRole("button", { name: "Falsch" }).click();

    await expect(score).toHaveText("0");
  });
});
