import { expect, test } from "@e2e/fixtures";
import { getPlayedSounds } from "@e2e/helpers/audio";

test.describe("Buzzer", () => {
  test("Buzzer per Leertaste aktiviert Team und zeigt Spielername", async ({
    createRoomWithPlayers
  }) => {
    const { host, players } = await createRoomWithPlayers(1);
    const [player] = players;
    if (!player) throw new Error("Spieler fehlt");

    await player.roomPage.teamOne.join();
    await expect(player.roomPage.buzzerButton).toBeVisible();
    await expect(host.roomPage.teamOne.root).toHaveAttribute(
      "data-buzzer-active",
      "false"
    );

    await player.roomPage.pressBuzzerViaSpacebar();

    await expect(host.roomPage.teamOne.root).toHaveAttribute(
      "data-buzzer-active",
      "true"
    );
    await expect(host.roomPage.teamTwo.root).toHaveAttribute(
      "data-buzzer-active",
      "false"
    );
    await expect(host.roomPage.teamOne.buzzerBadge).toContainText(
      player.username
    );
    await expect
      .poll(() => getPlayedSounds(host.page))
      .toContain("/static/audio/sound_effects/buzzerSound_1.mp3");
  });

  test("Buzzer per Button aktiviert das Team des Spielers", async ({
    createRoomWithPlayers
  }) => {
    const { host, players } = await createRoomWithPlayers(1);
    const [player] = players;
    if (!player) throw new Error("Spieler fehlt");

    await player.roomPage.teamTwo.join();
    await player.roomPage.pressBuzzerViaButton();

    await expect(host.roomPage.teamTwo.root).toHaveAttribute(
      "data-buzzer-active",
      "true"
    );
    await expect(host.roomPage.teamTwo.buzzerBadge).toBeVisible();
  });

  test("Gesperrte Buzzer lösen nicht aus und zeigen einen Hinweis", async ({
    createRoomWithPlayers
  }) => {
    const { host, players } = await createRoomWithPlayers(1);
    const [player] = players;
    if (!player) throw new Error("Spieler fehlt");

    await player.roomPage.teamOne.join();
    await host.roomPage.modPanel.open();
    await host.roomPage.modPanel.toggleBuzzerLock();
    await expect(host.roomPage.modPanel.buzzerToggle).toHaveText(
      /Alle Buzzer entsperren/
    );
    await host.roomPage.modPanel.close();

    await player.roomPage.pressBuzzerViaButton();

    await expect(player.page.getByText("Buzzer ist gesperrt!")).toBeVisible();
    await expect(host.roomPage.teamOne.root).toHaveAttribute(
      "data-buzzer-active",
      "false"
    );
  });

  test("Moderator gibt alle Buzzer wieder frei", async ({
    createRoomWithPlayers
  }) => {
    const { host, players } = await createRoomWithPlayers(1);
    const [player] = players;
    if (!player) throw new Error("Spieler fehlt");

    await player.roomPage.teamOne.join();
    await player.roomPage.pressBuzzerViaButton();
    await expect(host.roomPage.teamOne.root).toHaveAttribute(
      "data-buzzer-active",
      "true"
    );

    await host.roomPage.modPanel.open();
    // The button stays disabled while the scorebar timer runs; click auto-waits
    await host.roomPage.modPanel.releaseBuzzers();
    await host.roomPage.modPanel.close();

    await expect(host.roomPage.teamOne.root).toHaveAttribute(
      "data-buzzer-active",
      "false"
    );
    await expect(host.roomPage.teamOne.buzzerBadge).toBeHidden();
    await expect(player.roomPage.teamOne.root).toHaveAttribute(
      "data-buzzer-active",
      "false"
    );
  });
});
