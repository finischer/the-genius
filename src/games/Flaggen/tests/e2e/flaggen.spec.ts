import { expect, test } from "@e2e/fixtures";
import { trackBrowserErrors } from "@e2e/helpers/browserErrors";
import { RoomPage } from "@e2e/pages/RoomPage";

// ── Flaggen game fixture data ─────────────────────────────────────────────────

// Two real countries so we can verify qIndex navigation (Deutschland → Frankreich)
const FLAGGEN_GAME = {
  identifier: "flaggen",
  name: "Flaggen",
  maxPoints: 7,
  scorebarMode: "circle",
  modes: ["DUELL", "TEAM"],
  countries: [
    { id: "de", shortCode: "de", country: "Deutschland" },
    { id: "fr", shortCode: "fr", country: "Frankreich" }
  ],
  qIndex: 0,
  display: { answer: false, country: false },
  rules: ""
};

test.describe("Flaggen – Spielablauf", () => {
  test("Flagge sichtbar, Antwort aufdecken, Weiter zeigt nächste Flagge", async ({
    workerSession,
    seedRoom
  }) => {
    const browserErrors = trackBrowserErrors(workerSession);
    const { roomId } = await seedRoom([FLAGGEN_GAME]);
    const roomPage = new RoomPage(workerSession);

    await roomPage.goto(roomId);
    await roomPage.waitForRoomLoaded();
    await roomPage.startGame("Flaggen");

    const game = roomPage.game("flaggen");
    await expect(game).toBeVisible();

    const flag = game.getByRole("img", { name: "Deutschland" });
    await expect(flag).toHaveAttribute("src", /\/de\.png/);

    await game.getByRole("button", { name: "Antwort aufdecken" }).click();
    await expect(
      game.getByRole("button", { name: "Antwort wird angezeigt" })
    ).toBeVisible();
    await expect(workerSession.getByText("Deutschland")).toBeVisible();

    await game.getByRole("button", { name: "Weiter" }).click();

    await expect(game.getByRole("img", { name: "Frankreich" })).toHaveAttribute(
      "src",
      /\/fr\.png/
    );
    await expect(
      game.getByRole("button", { name: "Antwort aufdecken" })
    ).toBeVisible();

    expect(browserErrors.errors, browserErrors.format()).toHaveLength(0);
  });
});
