import { expect, test } from "@e2e/fixtures";
import { FLAGGEN_GAME, FLAGGEN_GAME_NAME } from "@e2e/helpers/roomGames";

test.describe("Room", () => {
  test("Raum wird mit eindeutiger URL und Grundelementen geöffnet", async ({
    createRoomWithPlayers
  }) => {
    const first = await createRoomWithPlayers(1);
    const second = await createRoomWithPlayers(1);

    expect(first.roomId).not.toBe(second.roomId);
    await expect(first.host.page).toHaveURL(
      new RegExp(`/room/${first.roomId}`)
    );
    await expect(second.host.page).toHaveURL(
      new RegExp(`/room/${second.roomId}`)
    );

    const { roomPage } = first.host;
    await expect(roomPage.header).toBeVisible();
    await expect(roomPage.footer).toBeVisible();
    await expect(roomPage.teamOne.root).toBeVisible();
    await expect(roomPage.teamTwo.root).toBeVisible();
  });

  test("Moderator öffnet das ModPanel und sieht die Spielauswahl", async ({
    createRoomWithPlayers
  }) => {
    const { host } = await createRoomWithPlayers(1, {
      games: [FLAGGEN_GAME]
    });

    await host.roomPage.modPanel.open();
    await host.roomPage.modPanel.expandStartGames();

    await expect(
      host.roomPage.modPanel.gameButton(FLAGGEN_GAME_NAME)
    ).toBeVisible();
  });

  test("Spielstart wird im ModPanel als laufend markiert", async ({
    createRoomWithPlayers
  }) => {
    const { host, players } = await createRoomWithPlayers(1, {
      games: [FLAGGEN_GAME]
    });

    await host.roomPage.modPanel.open();
    await host.roomPage.modPanel.startGame(FLAGGEN_GAME_NAME);

    await expect(
      host.roomPage.modPanel.activeGameButton(FLAGGEN_GAME_NAME)
    ).toBeVisible();
    const [player] = players;
    if (!player) throw new Error("Spieler fehlt");
    await expect(player.roomPage.game("flaggen")).toBeVisible();
  });

  test("Moderator vergibt Punkte und der Stand überlebt einen Reload", async ({
    createRoomWithPlayers
  }) => {
    const { host } = await createRoomWithPlayers(1, {
      games: [FLAGGEN_GAME]
    });
    const { roomPage } = host;

    await roomPage.startGame(FLAGGEN_GAME_NAME);
    await roomPage.teamOne.increment();
    await roomPage.teamOne.increment();
    await roomPage.teamTwo.increment();
    await roomPage.teamOne.decrement();

    await expect(roomPage.teamOne.score).toHaveAttribute("data-score", "1");
    await expect(roomPage.teamTwo.score).toHaveAttribute("data-score", "1");

    await host.page.reload();
    await roomPage.waitForRoomLoaded();

    await expect(roomPage.teamOne.score).toHaveAttribute("data-score", "1");
    await expect(roomPage.teamTwo.score).toHaveAttribute("data-score", "1");
  });
});
