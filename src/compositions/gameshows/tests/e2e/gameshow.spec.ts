import type { Page } from "@playwright/test";
import { expect, test } from "@e2e/fixtures";
import type { IResourceTracker } from "@e2e/fixtures/cleanup";
import { getE2ePrisma } from "@e2e/helpers/db";
import { FLAGGEN_GAME } from "@e2e/helpers/roomGames";
import { createGameshowViaApi } from "@e2e/helpers/trpc";
import { GameshowEditorPage } from "@e2e/pages/GameshowEditorPage";
import { GameshowListPage } from "@e2e/pages/GameshowListPage";
import { createE2eName } from "@e2e/support/names";
import { DEFAULT_MERKEN_STATE } from "~/games/Merken/config";

const REDIRECT_TIMEOUT = 10_000;
const MERKEN = "merken";
const MERKEN_TIME_TO_THINK = "45";
const SUCCESS_MESSAGE = "Spielshow wurde gespeichert";
const NAME_REQUIRED_MESSAGE = "Name ist erforderlich";
const NOT_FOUND_MESSAGE = "Spielshow existiert nicht.";

interface ITrpcErrorBody {
  error: { json: { data: { code: string } } };
}

async function findGameshowId(name: string): Promise<string> {
  const gameshow = await getE2ePrisma().gameshow.findFirst({
    where: { name },
    select: { id: true }
  });
  if (!gameshow) throw new Error(`Gameshow "${name}" nicht in der DB gefunden`);
  return gameshow.id;
}

async function countGameshows(name: string): Promise<number> {
  return getE2ePrisma().gameshow.count({ where: { name } });
}

/** Clicks "next" from the game picker step to the name step. */
async function goToDetailsStep(
  editor: GameshowEditorPage,
  gameCount: number
): Promise<void> {
  for (let step = 0; step <= gameCount; step++) {
    await editor.next();
  }
  await expect(editor.nameInput).toBeVisible();
}

async function pickGames(
  editor: GameshowEditorPage,
  games: readonly string[]
): Promise<void> {
  for (const game of games) {
    await editor.addGame(game);
  }
  await expect(editor.gameListItems()).toHaveCount(games.length);
}

async function createGameshowViaUi(
  page: Page,
  tracker: IResourceTracker,
  name: string,
  games: readonly string[] = [MERKEN]
): Promise<string> {
  const editor = new GameshowEditorPage(page);
  await editor.goto();
  await pickGames(editor, games);
  await goToDetailsStep(editor, games.length);
  await editor.setName(name);
  await editor.next();
  await editor.save();
  await expect(page).toHaveURL(/\/gameshows$/, { timeout: REDIRECT_TIMEOUT });
  const id = await findGameshowId(name);
  tracker.trackGameshow(id);
  return id;
}

/**
 * Creates a gameshow with two valid games (Merken, Flaggen) through the API.
 * Every configurator validates its input, so building such a show in the UI
 * would need game-specific data entry that is irrelevant for these tests.
 */
async function createTwoGameShowViaApi(
  page: Page,
  tracker: IResourceTracker,
  name: string
): Promise<string> {
  const { id } = await createGameshowViaApi(page.request, {
    name,
    games: [DEFAULT_MERKEN_STATE, FLAGGEN_GAME]
  });
  tracker.trackGameshow(id);
  return id;
}

async function openForEdit(
  page: Page,
  gameshowId: string
): Promise<GameshowEditorPage> {
  const editor = new GameshowEditorPage(page);
  await editor.goto(gameshowId);
  return editor;
}

test.describe("Gameshow-Verwaltung", { tag: "@gameshows" }, () => {
  test("neue Gameshow erscheint in der Liste und zeigt Erfolgsmeldung", async ({
    workerSession,
    tracker
  }) => {
    const name = createE2eName();
    await createGameshowViaUi(workerSession, tracker, name);

    const list = new GameshowListPage(workerSession);
    await expect(list.row(name)).toBeVisible({ timeout: REDIRECT_TIMEOUT });
    await expect(
      workerSession.getByRole("alert").filter({ hasText: SUCCESS_MESSAGE })
    ).toBeVisible();
  });

  test("gespeicherte Gameshow wird beim erneuten Öffnen identisch geladen", async ({
    workerSession,
    tracker
  }) => {
    const name = createE2eName();
    const id = await createTwoGameShowViaApi(workerSession, tracker, name);

    const editor = await openForEdit(workerSession, id);
    await expect(editor.gameListItems()).toHaveCount(2);
    await editor.next();
    const timeInput = workerSession.getByLabel("Nachdenkzeit");
    await timeInput.fill(MERKEN_TIME_TO_THINK);
    await expect(timeInput).toHaveValue(MERKEN_TIME_TO_THINK);
    await editor.next();
    await editor.next();
    await editor.next();
    await editor.save();
    await expect(workerSession).toHaveURL(/\/gameshows$/, {
      timeout: REDIRECT_TIMEOUT
    });

    const reopened = await openForEdit(workerSession, id);
    await expect(reopened.gameListItems()).toHaveCount(2);
    await expect(reopened.gameListItems().nth(0)).toContainText("Merken");
    await expect(reopened.gameListItems().nth(1)).toContainText("Flaggen");
    await reopened.next();
    await expect(workerSession.getByLabel("Nachdenkzeit")).toHaveValue(
      MERKEN_TIME_TO_THINK
    );
    await reopened.next();
    await reopened.next();
    await expect(reopened.nameInput).toHaveValue(name);
  });
  test("geänderte Reihenfolge der Spiele bleibt nach Neuladen erhalten", async ({
    workerSession,
    tracker
  }) => {
    const name = createE2eName();
    const id = await createTwoGameShowViaApi(workerSession, tracker, name);

    const editor = await openForEdit(workerSession, id);
    const items = editor.gameListItems();
    await expect(items).toHaveCount(2);
    await expect(items.nth(0)).toContainText("Merken");

    const grip = items.nth(0).locator("svg").first();
    const gripBox = await grip.boundingBox();
    const targetBox = await items.nth(1).boundingBox();
    if (!gripBox || !targetBox) throw new Error("Drag-Ziel nicht sichtbar");
    await workerSession.mouse.move(
      gripBox.x + gripBox.width / 2,
      gripBox.y + gripBox.height / 2
    );
    await workerSession.mouse.down();
    await workerSession.mouse.move(
      gripBox.x + gripBox.width / 2,
      targetBox.y + targetBox.height * 1.2,
      { steps: 15 }
    );
    await workerSession.mouse.up();
    await expect(items.nth(0)).toContainText("Flaggen");
    await expect(items.nth(1)).toContainText("Merken");

    await goToDetailsStep(editor, 2);
    await editor.next();
    await editor.save();
    await expect(workerSession).toHaveURL(/\/gameshows$/, {
      timeout: REDIRECT_TIMEOUT
    });

    const reloaded = await openForEdit(workerSession, id);
    await workerSession.reload();
    await expect(reloaded.gameListItems().nth(0)).toContainText("Flaggen");
    await expect(reloaded.gameListItems().nth(1)).toContainText("Merken");
  });

  test("gelöschte Gameshow verschwindet aus der Liste und bleibt weg", async ({
    workerSession,
    tracker
  }) => {
    const name = createE2eName();
    await createGameshowViaUi(workerSession, tracker, name);
    const list = new GameshowListPage(workerSession);
    await list.goto();
    await expect(list.row(name)).toBeVisible();

    await list.delete(name);
    await expect(list.row(name)).toHaveCount(0, { timeout: REDIRECT_TIMEOUT });

    await workerSession.reload();
    await expect(list.createButton).toBeVisible();
    await expect(list.row(name)).toHaveCount(0);
    expect(await countGameshows(name)).toBe(0);
  });

  for (const [label, invalidName] of [
    ["leerem Namen", ""],
    ["Namen nur aus Leerzeichen", "   "]
  ] as const) {
    test(`Speichern mit ${label} wird verhindert`, async ({
      workerSession
    }) => {
      const requests: string[] = [];
      workerSession.on("request", (request) => {
        if (request.url().includes("gameshows.create")) {
          requests.push(request.url());
        }
      });

      const editor = new GameshowEditorPage(workerSession);
      await editor.goto();
      await pickGames(editor, [MERKEN]);
      await editor.next();
      await workerSession.getByLabel("Nachdenkzeit").fill(MERKEN_TIME_TO_THINK);
      await editor.next();
      await editor.setName("e2e-vorlaeufig");
      await editor.nameInput.fill(invalidName);

      await expect(
        workerSession.getByText(NAME_REQUIRED_MESSAGE)
      ).toBeVisible();
      await expect(editor.nextButton).toBeDisabled();
      expect(requests).toEqual([]);

      await editor.previous();
      await expect(workerSession.getByLabel("Nachdenkzeit")).toHaveValue(
        MERKEN_TIME_TO_THINK
      );
      await editor.previous();
      await expect(editor.gameListItems()).toHaveCount(1);
    });
  }

  test(
    "fremde Gameshow ist weder les-, änderbar noch löschbar",
    {
      annotation: {
        type: "expected-error",
        description:
          "foreign gameshow returns NOT_FOUND/FORBIDDEN and the UI shows 'Spielshow existiert nicht.'"
      }
    },
    async ({ workerSession, userSession, tracker }) => {
      const name = createE2eName();
      const { id } = await createGameshowViaApi(workerSession.request, {
        name
      });
      tracker.trackGameshow(id);

      const input = encodeURIComponent(
        JSON.stringify({ json: { gameshowId: id } })
      );
      const read = await userSession.request.get(
        `/api/trpc/gameshows.getById?input=${input}`
      );
      expect(read.status()).toBe(404);
      expect(((await read.json()) as ITrpcErrorBody).error.json.data.code).toBe(
        "NOT_FOUND"
      );

      const update = await userSession.request.post(
        "/api/trpc/gameshows.update",
        {
          data: {
            json: {
              gameshowId: id,
              updatedGameshow: { name: "e2e-uebernommen", games: [] }
            }
          },
          headers: { "Content-Type": "application/json" }
        }
      );
      expect(update.status()).toBe(404);

      const remove = await userSession.request.post(
        "/api/trpc/gameshows.delete",
        {
          data: { json: { gameshowId: id } },
          headers: { "Content-Type": "application/json" }
        }
      );
      expect(remove.status()).toBe(403);
      expect(
        ((await remove.json()) as ITrpcErrorBody).error.json.data.code
      ).toBe("FORBIDDEN");

      const editor = await openForEdit(userSession, id);
      await expect(
        userSession.getByText(NOT_FOUND_MESSAGE).first()
      ).toBeVisible({
        timeout: 15_000
      });
      await expect(editor.gameListItems()).toHaveCount(0);

      const stored = await getE2ePrisma().gameshow.findUnique({
        where: { id },
        select: { name: true }
      });
      expect(stored?.name).toBe(name);
    }
  );

  test(
    "Speicherfehler zeigt Fehlermeldung, legt nichts an und behält die Eingaben",
    {
      annotation: {
        type: "expected-error",
        description:
          "gameshows.create is aborted on purpose, so the browser logs 'Failed to fetch'"
      }
    },
    async ({ workerSession }) => {
      await workerSession.route("**/api/trpc/gameshows.create*", (route) =>
        route.abort()
      );
      const name = createE2eName();
      const editor = new GameshowEditorPage(workerSession);
      await editor.goto();
      await pickGames(editor, [MERKEN]);
      await goToDetailsStep(editor, 1);
      await editor.setName(name);
      await editor.next();
      await editor.save();

      await expect(
        workerSession.getByRole("alert").filter({ hasText: "Fehler" })
      ).toBeVisible();
      await expect(workerSession).toHaveURL(/\/gameshows\/create/);
      expect(await countGameshows(name)).toBe(0);

      await editor.previous();
      await expect(editor.nameInput).toHaveValue(name);
    }
  );
});
