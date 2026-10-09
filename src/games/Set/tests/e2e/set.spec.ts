import { expect, test } from "@e2e/fixtures";
import { trackBrowserErrors } from "@e2e/helpers/browserErrors";
import { RoomPage } from "@e2e/pages/RoomPage";

// ── Set game fixture data ────────────────────────────────────────────────────
//
// We build one question with 6 cards and two openedCards groups:
//
//   Valid set  → cards 0, 1, 2
//     form:   oval  / oval  / oval    → all same ✓
//     color:  red   / green / blue    → all different ✓
//     fill:   filled/ filled/ filled  → all same ✓
//     amount: 1     / 2     / 3       → all different ✓
//
//   Invalid combo → cards 3, 4, 5
//     form:   rectangle / rectangle / diamond → 2×same, 1×different ✗
//     (this alone makes it invalid)

const SET_CARDS = [
  // ── valid set ──────────────────────────────────────
  { id: "c0", form: "oval", color: "red", fill: "filled", amount: 1 },
  { id: "c1", form: "oval", color: "green", fill: "filled", amount: 2 },
  { id: "c2", form: "oval", color: "blue", fill: "filled", amount: 3 },
  // ── no-set group ──────────────────────────────────
  { id: "c3", form: "rectangle", color: "red", fill: "none", amount: 1 },
  { id: "c4", form: "rectangle", color: "red", fill: "dashed", amount: 2 },
  { id: "c5", form: "diamond", color: "blue", fill: "filled", amount: 3 }
];

const SET_GAME = {
  identifier: "set",
  name: "Set",
  maxPoints: 7,
  scorebarMode: "circle",
  modes: ["DUELL", "TEAM"],
  questions: [
    {
      id: "q1",
      cards: SET_CARDS
    }
  ],
  qIndex: 0,
  // All cards are pre-flipped so the moderator can immediately select them
  openedCards: [0, 1, 2, 3, 4, 5],
  markedCards: [],
  markedCardsState: "marked",
  display: { cards: true, markedCards: false },
  rules: ""
};

test.describe("Set – Karten-Grid und Set-Validierung", () => {
  test("Karten-Grid sichtbar; valides Set → correct, invalides Set → wrong", async ({
    workerSession,
    seedRoom
  }) => {
    const browserErrors = trackBrowserErrors(workerSession);
    const { roomId } = await seedRoom([SET_GAME]);
    const roomPage = new RoomPage(workerSession);

    await roomPage.goto(roomId);
    await roomPage.waitForRoomLoaded();
    await roomPage.startGame("Set");

    const game = roomPage.game("set");
    const card = (position: number) => game.getByTestId(`set-card-${position}`);
    const showMarkedButton = game.getByRole("button", {
      name: "Markierte Karten zeigen"
    });
    const showAnswerButton = game.getByRole("button", {
      name: "Antwort zeigen"
    });

    await expect(game).toBeVisible();
    await expect(game.getByTestId(/^set-card-/)).toHaveCount(SET_CARDS.length);

    // Valid set: cards 1-3
    for (const position of [1, 2, 3]) await card(position).click();
    await expect(showMarkedButton).toBeEnabled();
    await showMarkedButton.click();
    await expect(showAnswerButton).toBeEnabled();
    await showAnswerButton.click();
    await expect(card(1)).toHaveAttribute("data-marker-state", "correct");

    // "Karten umdrehen" resets marks and state; the second click re-opens all
    const flipButton = game.getByRole("button", { name: "Karten umdrehen" });
    await flipButton.click();
    await flipButton.click();
    await expect(card(1)).toHaveAttribute("data-marker-state", "none");

    // Invalid combination: cards 4-6
    for (const position of [4, 5, 6]) await card(position).click();
    await expect(showMarkedButton).toBeEnabled();
    await showMarkedButton.click();
    await expect(showAnswerButton).toBeEnabled();
    await showAnswerButton.click();
    await expect(card(4)).toHaveAttribute("data-marker-state", "wrong");

    expect(browserErrors.errors, browserErrors.format()).toHaveLength(0);
  });
});
