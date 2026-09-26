/**
 * Task 11.1 – Requirements 7.1, 7.2, 7.5
 *
 * Parameterised smoke tests: for each of the eight games, activate it in a
 * Room and verify
 *  1. the game area element (`[data-testid="game-area"] [data-game="<id>"]`)
 *     becomes visible within 3 seconds (Requirement 7.2), and
 *  2. no uncaught JS exceptions or console ERROR-level messages are emitted
 *     during the entire test (Requirements 7.1, 7.5).
 */
import { test, expect } from "../../fixtures/index";
import { RoomPage } from "../../pages/RoomPage";

// Game identifiers (enum values) and their display names as shown in the
// ModPanel accordion – sourced from src/games/core/games.config.ts.
const GAMES_TO_TEST: Array<{ identifier: string; displayName: string }> = [
  { identifier: "duSagst", displayName: "Du Sagst" },
  { identifier: "flaggen", displayName: "Flaggen" },
  { identifier: "fragenhagel", displayName: "Fragenhagel" },
  { identifier: "geheimwoerter", displayName: "Geheimwörter" },
  { identifier: "merken", displayName: "Merken" },
  { identifier: "referatBingo", displayName: "Referat Bingo" },
  { identifier: "set", displayName: "Set" },
  { identifier: "zehnSetzen", displayName: "Zehn Setzen" }
];

for (const game of GAMES_TO_TEST) {
  test(
    `${game.displayName} – rendert ohne JS-Fehler`,
    async ({ authenticatedContext, roomWithAllGamesContext }) => {
      const page = await authenticatedContext.newPage();

      // Collect any uncaught page errors (Requirement 7.5)
      const pageErrors: Error[] = [];
      page.on("pageerror", (err) => pageErrors.push(err));

      // Collect console ERROR messages (Requirements 7.1, 7.5)
      const consoleErrors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text());
        }
      });

      try {
        const roomPage = new RoomPage(page);
        await roomPage.goto(roomWithAllGamesContext.roomId);
        await roomPage.waitForRoomLoaded();

        // Open the ModPanel and activate the target game
        await roomPage.openModPanel();
        await roomPage.activateGameByName(game.displayName);

        // Wait for the active indicator on the ModPanel button (Requirement 5.3)
        await roomPage.waitForActiveGameIndicator(game.displayName, 3000);

        // Close the ModPanel by pressing Escape so the game area is visible
        await page.keyboard.press("Escape");

        // Requirement 7.2: the game area must contain a child with the correct
        // data-game attribute within 3 seconds
        await expect(
          page.locator(
            `[data-testid="game-area"] [data-game="${game.identifier}"]`
          )
        ).toBeVisible({ timeout: 3000 });

        // Requirements 7.1 + 7.5: no uncaught JS exceptions or console errors
        expect(
          pageErrors,
          `Uncaught errors while rendering ${game.displayName}: ${pageErrors.map((e) => e.message).join(", ")}`
        ).toHaveLength(0);

        expect(
          consoleErrors,
          `Console errors while rendering ${game.displayName}: ${consoleErrors.join(", ")}`
        ).toHaveLength(0);
      } finally {
        await page.close();
      }
    }
  );
}
