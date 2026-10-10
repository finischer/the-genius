import { expect, test } from "@e2e/fixtures";
import { getPlayedSounds } from "@e2e/helpers/audio";

// Playwright dispatches key presses to separate pages with a few ms of jitter,
// so 1ms leads flip randomly; 25ms is reliably preserved up to the server.
const EARLY_PRESS_LEAD_MS = 25;

test.describe("Buzzer", () => {
  test("Buzzer per Leertaste aktiviert Team und zeigt Spielername", async ({
    createRoomWithPlayers
  }) => {
    const { host, players } = await createRoomWithPlayers(1);
    const [player] = players;
    if (!player) throw new Error("Spieler fehlt");

    await player.roomPage.teamOne.join();
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

  for (const firstTeam of ["teamOne", "teamTwo"] as const) {
    test(`Gleichzeitiges Buzzern: ${firstTeam} drückt ${EARLY_PRESS_LEAD_MS}ms früher und gewinnt für alle`, async ({
      createRoomWithPlayers
    }) => {
      const { host, players } = await createRoomWithPlayers(2);
      const [one, two] = players;
      if (!one || !two) throw new Error("Spieler fehlen");

      await one.roomPage.teamOne.join();
      await two.roomPage.teamTwo.join();

      const [early, late] = firstTeam === "teamOne" ? [one, two] : [two, one];

      const earlyPress = early.roomPage.pressBuzzerViaSpacebar();
      await new Promise((resolve) => setTimeout(resolve, EARLY_PRESS_LEAD_MS));
      const latePress = late.roomPage.pressBuzzerViaSpacebar();
      await Promise.all([earlyPress, latePress]);

      const pages = [host.roomPage, one.roomPage, two.roomPage];
      const getWinner = async (): Promise<string | null> => {
        const winners = await Promise.all(
          pages.map(async (page) => {
            const [teamOne, teamTwo] = await Promise.all([
              page.teamOne.root.getAttribute("data-buzzer-active"),
              page.teamTwo.root.getAttribute("data-buzzer-active")
            ]);
            if (teamOne === "true" && teamTwo !== "true") return "teamOne";
            if (teamTwo === "true" && teamOne !== "true") return "teamTwo";
            return null;
          })
        );
        const [first] = winners;
        return first && winners.every((w) => w === first) ? first : null;
      };

      // Exactly one team is active, all clients agree and it is the early one
      await expect.poll(getWinner).toBe(firstTeam);
    });
  }

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
