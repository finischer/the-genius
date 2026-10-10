import { expect, test } from "@e2e/fixtures";
import { trackBrowserErrors } from "@e2e/helpers/browserErrors";
import { RoomPage } from "@e2e/pages/RoomPage";

// ── Merken game fixture data ──────────────────────────────────────────────────
//
// Six cards using the canonical /icons/merken/<n>.png paths.
// allCardsFlipped starts as false; the "Spiel starten" button sets it to true
// and kicks off the countdown timer.
const MERKEN_CARDS = [
  "/icons/merken/1.png",
  "/icons/merken/2.png",
  "/icons/merken/3.png",
  "/icons/merken/4.png",
  "/icons/merken/5.png",
  "/icons/merken/6.png"
];

const MERKEN_GAME = {
  identifier: "merken",
  name: "Merken",
  maxPoints: 7,
  scorebarMode: "circle",
  modes: ["DUELL", "TEAM"],
  allCardsFlipped: false,
  cards: MERKEN_CARDS,
  openCards: [] as number[],
  timerState: {
    isActive: false,
    timeToThinkSeconds: 10
  },
  rules: ""
};

test.describe("Merken – Karten sichtbar, Recall-Phase funktioniert", () => {
  let roomPage: RoomPage;

  test.beforeEach(async ({ workerSession, seedRoom }) => {
    const { roomId } = await seedRoom([MERKEN_GAME]);
    roomPage = new RoomPage(workerSession);
    await roomPage.goto(roomId);
    await roomPage.waitForRoomLoaded();
    await roomPage.startGame("Merken");
    await expect(roomPage.game("merken")).toBeVisible();
  });

  test("Memorisierungsphase: Karten sichtbar und Countdown läuft", async ({
    workerSession
  }) => {
    const browserErrors = trackBrowserErrors(workerSession);
    const game = roomPage.game("merken");

    for (let i = 1; i <= MERKEN_CARDS.length; i++) {
      await expect(game.getByTestId(`merken-card-${i}`)).toHaveAttribute(
        "data-flipped",
        "false"
      );
    }

    await game.getByRole("button", { name: "Spiel starten" }).click();

    for (let i = 1; i <= MERKEN_CARDS.length; i++) {
      await expect(game.getByTestId(`merken-card-${i}`)).toHaveAttribute(
        "data-flipped",
        "true"
      );
    }
    await expect(game.getByRole("img")).toHaveCount(MERKEN_CARDS.length);
    await expect(workerSession.getByTestId("room-timer")).toHaveText(/^\d+$/);

    expect(browserErrors.errors, browserErrors.format()).toHaveLength(0);
  });

  test("Recall-Phase: Karten verdeckt, Karte klicken deckt sie auf", async ({
    workerSession
  }) => {
    const browserErrors = trackBrowserErrors(workerSession);
    const game = roomPage.game("merken");

    for (let i = 1; i <= MERKEN_CARDS.length; i++) {
      await expect(game.getByTestId(`merken-card-${i}`)).toContainText(
        String(i)
      );
    }

    const firstCard = game.getByTestId("merken-card-1");
    await expect(firstCard).toHaveAttribute("data-flipped", "false");

    await firstCard.click();

    await expect(firstCard).toHaveAttribute("data-flipped", "true");
    await expect(firstCard.getByRole("img")).toHaveAttribute(
      "src",
      /icons(\/|%2F)merken(\/|%2F)1/
    );

    expect(browserErrors.errors, browserErrors.format()).toHaveLength(0);
  });
});
