import { expect, test } from "@e2e/fixtures";
import { trackBrowserErrors } from "@e2e/helpers/browserErrors";
import { blockExternalServices } from "@e2e/fixtures/auth";
import { RoomPage } from "@e2e/pages/RoomPage";

// ── Geheimwörter game fixture data ────────────────────────────────────────────

// Two questions with distinct secret words so we can test navigation
const GEHEIMWOERTER_GAME = {
  identifier: "geheimwoerter",
  name: "Geheimwörter",
  maxPoints: 7,
  scorebarMode: "circle",
  modes: ["DUELL", "TEAM"],
  answer: "",
  qIndex: 0,
  codeList: [
    { id: "cl1", letter: "A", category: "Automarke" },
    { id: "cl2", letter: "B", category: "Beruf" }
  ],
  questions: [
    {
      id: "q1",
      answer: "APFEL",
      words: [
        { word: "Frucht", category: "Automarke" },
        { word: "Rund", category: "Beruf" }
      ]
    },
    {
      id: "q2",
      answer: "BUCH",
      words: [
        { word: "Lesen", category: "Automarke" },
        { word: "Papier", category: "Beruf" }
      ]
    }
  ],
  display: {
    answer: false,
    codeList: false,
    words: false
  },
  rules: ""
};

test.describe("Geheimwörter – Spielablauf", () => {
  test("Wort sichtbar für Beschreiber, nicht für andere; Aufdecken zeigt Antwort", async ({
    workerSession,
    browser,
    baseURL,
    seedRoom
  }) => {
    const browserErrors = trackBrowserErrors(workerSession);
    const { roomId } = await seedRoom([GEHEIMWOERTER_GAME]);
    const roomPage = new RoomPage(workerSession);

    await roomPage.goto(roomId);
    await roomPage.waitForRoomLoaded();
    await roomPage.startGame("Geheimwörter");

    const game = roomPage.game("geheimwoerter");
    await expect(game).toBeVisible();
    await expect(game.getByText("Frucht")).toBeVisible();

    const spectatorContext = await browser.newContext({ baseURL });
    try {
      await blockExternalServices(spectatorContext);
      const spectatorPage = await spectatorContext.newPage();
      const spectatorRoom = new RoomPage(spectatorPage);
      await spectatorRoom.goto(roomId);

      // The container is empty (zero size) for spectators while the words are hidden
      await expect(spectatorRoom.game("geheimwoerter")).toBeAttached();
      await expect(
        spectatorRoom.game("geheimwoerter").getByText("Frucht")
      ).toBeHidden();
    } finally {
      await spectatorContext.close();
    }

    // Host toggles word list visibility by clicking the ModToggle content
    await game.getByText("Frucht").click();

    const revealButton = game.getByRole("button", {
      name: "Antwort aufdecken"
    });
    await expect(revealButton).toBeEnabled();
    await revealButton.click();

    // The reveal button is replaced by the answer banner
    await expect(revealButton).toBeHidden();
    await expect(workerSession.getByText("APFEL")).toBeVisible();

    expect(browserErrors.errors, browserErrors.format()).toHaveLength(0);
  });
});
