import { expect, test } from "@e2e/fixtures";
import { RoomPage } from "@e2e/pages/RoomPage";

test.describe("MediaPlayer", () => {
  let roomPage: RoomPage;

  test.beforeEach(async ({ workerSession, seedRoom }) => {
    const { roomId } = await seedRoom([]);
    roomPage = new RoomPage(workerSession);
    await roomPage.goto(roomId);
    await roomPage.waitForRoomLoaded();
    await roomPage.modPanel.open();
  });

  test("MediaPlayer im ModPanel sichtbar", async ({ workerSession }) => {
    await expect(
      workerSession.getByTestId("mod-panel-media-player")
    ).toBeVisible();
  });

  test("Play/Pause-Toggle", async ({ workerSession }) => {
    const mediaPlayer = workerSession.getByTestId("mod-panel-media-player");
    const playButton = mediaPlayer.getByRole("button", { name: "Wiedergabe" });
    const pauseButton = mediaPlayer.getByRole("button", { name: "Pause" });

    await expect(playButton).toBeVisible();

    await playButton.click();
    await expect(pauseButton).toBeVisible();
    await expect(playButton).toBeHidden();

    await pauseButton.click();
    await expect(playButton).toBeVisible();
    await expect(pauseButton).toBeHidden();
  });
});
