import { test, expect } from "../fixtures/index";
import { RoomPage } from "../pages/RoomPage";

test.describe("MediaPlayer", () => {
  // Task 12.1 – Requirement 16.1
  test("MediaPlayer im ModPanel sichtbar", async ({
    authenticatedContext,
    roomContext
  }) => {
    const page = await authenticatedContext.newPage();
    const roomPage = new RoomPage(page);

    await roomPage.goto(roomContext.roomId);
    await roomPage.waitForRoomLoaded();

    await roomPage.openModPanel();

    // The MediaPlayer container has the CSS class "mod-panel-media-player"
    await expect(page.locator(".mod-panel-media-player")).toBeVisible({
      timeout: 5000
    });

    await page.close();
  });

  // Task 12.2 – Requirements 16.2, 16.3
  test("Play/Pause-Toggle", async ({ authenticatedContext, roomContext }) => {
    const page = await authenticatedContext.newPage();
    const roomPage = new RoomPage(page);

    await roomPage.goto(roomContext.roomId);
    await roomPage.waitForRoomLoaded();

    await roomPage.openModPanel();

    // Wait for MediaPlayer to be visible
    await expect(page.locator(".mod-panel-media-player")).toBeVisible({
      timeout: 5000
    });

    const mediaPlayer = page.locator(".mod-panel-media-player");

    // The play/pause button is the ActionIcon whose child is either
    // "tabler-icon-player-play" or "tabler-icon-player-pause".
    // Initially the music is not playing, so we expect the play icon to be visible.
    const playIcon = mediaPlayer.locator(".tabler-icon-player-play");
    const pauseIcon = mediaPlayer.locator(".tabler-icon-player-pause");

    // Verify initial state: play icon is present (music not playing)
    await expect(playIcon).toBeVisible({ timeout: 2000 });

    // Click the play button (the ActionIcon button wrapping the play icon)
    await playIcon.click();

    // After clicking play, the icon should switch to pause (Requirement 16.2)
    await expect(pauseIcon).toBeVisible({ timeout: 2000 });
    await expect(playIcon).not.toBeVisible({ timeout: 2000 });

    // Click the pause button
    await pauseIcon.click();

    // After clicking pause, the icon should switch back to play (Requirement 16.3)
    await expect(playIcon).toBeVisible({ timeout: 2000 });
    await expect(pauseIcon).not.toBeVisible({ timeout: 2000 });

    await page.close();
  });
});
