import { test, expect } from "../fixtures/index";
import { RoomPage } from "../pages/RoomPage";

test.describe("Room Navigation", () => {
  // Task 8.1 – Requirement 5.1
  test("Room-Grundelemente sichtbar", async ({
    authenticatedContext,
    roomContext
  }) => {
    const page = await authenticatedContext.newPage();
    const roomPage = new RoomPage(page);

    await roomPage.goto(roomContext.roomId);
    await roomPage.waitForRoomLoaded();

    await page.close();
  });

  // Task 8.2 – Requirement 5.2
  test("ModPanel öffnen", async ({ authenticatedContext, roomContext }) => {
    const page = await authenticatedContext.newPage();
    const roomPage = new RoomPage(page);

    await roomPage.goto(roomContext.roomId);
    await roomPage.waitForRoomLoaded();

    await roomPage.openModPanel();

    // Verify at least one game control element is present within the ModPanel
    await expect(
      page.locator(".mod-panel-start-games-accordion")
    ).toBeVisible({ timeout: 2000 });

    await page.close();
  });

  // Task 8.3 – Requirement 5.3
  test("Nächstes Spiel im ModPanel aktivieren", async ({
    authenticatedContext,
    roomWithGamesContext
  }) => {
    const page = await authenticatedContext.newPage();
    const roomPage = new RoomPage(page);

    await roomPage.goto(roomWithGamesContext.roomId);
    await roomPage.waitForRoomLoaded();

    await roomPage.openModPanel();

    // Expand "Spiel starten" accordion and click the first game
    const gameName = await roomPage.activateFirstGame();

    // Verify the active game indicator (button label gains "(Läuft gerade)")
    // updates within 2 seconds – this confirms the room state synced (Requirement 5.3)
    await roomPage.waitForActiveGameIndicator(gameName);

    await page.close();
  });
});
