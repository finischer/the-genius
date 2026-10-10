import { expect, test } from "@e2e/fixtures";
import { FLAGGEN_GAME, FLAGGEN_GAME_NAME } from "@e2e/helpers/roomGames";

test.describe("Multiplayer-Synchronisation", () => {
  test("Teambeitritt und -austritt sind für alle Teilnehmer sichtbar", async ({
    createRoomWithPlayers
  }) => {
    const { host, players } = await createRoomWithPlayers(3);
    const [one, two, spectator] = players;
    if (!one || !two || !spectator) throw new Error("Spieler fehlen");

    await one.roomPage.teamOne.join();
    await two.roomPage.teamTwo.join();

    for (const page of [host.roomPage, one.roomPage, spectator.roomPage]) {
      await expect(page.teamOne.teamName).toHaveText(one.username);
      await expect(page.teamTwo.teamName).toHaveText(two.username);
    }

    await one.roomPage.teamOne.leave();

    await expect(host.roomPage.teamOne.teamName).toHaveText("Team 1");
    await expect(spectator.roomPage.teamOne.teamName).toHaveText("Team 1");
    await expect(spectator.roomPage.teamTwo.teamName).toHaveText(two.username);
  });

  test("Punktestand des Moderators erscheint bei allen Spielern", async ({
    createRoomWithPlayers
  }) => {
    const { host, players } = await createRoomWithPlayers(2, {
      games: [FLAGGEN_GAME]
    });

    await host.roomPage.startGame(FLAGGEN_GAME_NAME);
    await host.roomPage.teamOne.increment();
    await host.roomPage.teamOne.increment();
    await host.roomPage.teamTwo.increment();

    for (const player of players) {
      await expect(player.roomPage.teamOne.score).toHaveAttribute(
        "data-score",
        "2"
      );
      await expect(player.roomPage.teamTwo.score).toHaveAttribute(
        "data-score",
        "1"
      );
    }
  });

  test("Buzzer-Zustand wird synchronisiert und der erste Buzzer gewinnt", async ({
    createRoomWithPlayers
  }) => {
    const { host, players } = await createRoomWithPlayers(2);
    const [one, two] = players;
    if (!one || !two) throw new Error("Spieler fehlen");

    await one.roomPage.teamOne.join();
    await two.roomPage.teamTwo.join();
    await one.roomPage.pressBuzzerViaButton();

    for (const page of [host.roomPage, one.roomPage, two.roomPage]) {
      await expect(page.teamOne.root).toHaveAttribute(
        "data-buzzer-active",
        "true"
      );
    }

    await two.roomPage.pressBuzzerViaButton();

    await expect(host.roomPage.teamTwo.root).toHaveAttribute(
      "data-buzzer-active",
      "false"
    );
    await expect(host.roomPage.teamOne.root).toHaveAttribute(
      "data-buzzer-active",
      "true"
    );
  });
});
