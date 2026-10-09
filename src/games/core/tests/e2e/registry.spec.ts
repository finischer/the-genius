import { test, expect } from "@e2e/fixtures";
import { createGameshowViaApi } from "@e2e/helpers/trpc";
import { trackBrowserErrors } from "@e2e/helpers/browserErrors";
import { GamesPickerPanel } from "@e2e/pages/GamesPickerPanel";
import { GameshowEditorPage } from "@e2e/pages/GameshowEditorPage";
import { GameshowListPage } from "@e2e/pages/GameshowListPage";
import { ModPanel } from "@e2e/pages/ModPanel";
import { RoomPage } from "@e2e/pages/RoomPage";
import { toKebab } from "@e2e/pages/toKebab";
import { buildGameCases, releasedGames } from "@e2e/support/gameCases";
import { createE2eName } from "@e2e/support/names";
import { DEFAULT_AUF_DEN_KOPF_GESTELLT_STATE } from "~/games/AufDenKopfGestellt/config";
import { DEFAULT_DUSAGST_STATE } from "~/games/DuSagst/config";
import { DEFAULT_FLAGGEN_STATE } from "~/games/Flaggen/config";
import { DEFAULT_FRAGENHAGEL_STATE } from "~/games/Fragenhagel/config";
import { DEFAULT_GEHEIMWOERTER_STATE } from "~/games/Geheimwörter/config";
import { DEFAULT_MERKEN_STATE } from "~/games/Merken/config";
import { DEFAULT_SET_STATE } from "~/games/Set/config";
import { DEFAULT_ZEHN_SETZEN_STATE } from "~/games/ZehnSetzen/config";
import { Game } from "~/games/core/types";

const GAME_AREA_TIMEOUT_MS = 10_000;
const ROOM_TEST_TIMEOUT_MS = 45_000;

// The game renders nothing without a question
const GEHEIMWOERTER_ROOM_STATE = {
  ...DEFAULT_GEHEIMWOERTER_STATE,
  questions: [
    {
      id: "q1",
      answer: "APFEL",
      words: [{ word: "Frucht", category: "Automarke" }]
    }
  ],
  codeList: [{ letter: "A", category: "Automarke" }]
};

const DEFAULT_STATES: Record<
  Exclude<Game, Game.REFERATBINGO>,
  object & { name: string }
> = {
  [Game.AUF_DEN_KOPF_GESTELLT]: DEFAULT_AUF_DEN_KOPF_GESTELLT_STATE,
  [Game.DUSAGST]: DEFAULT_DUSAGST_STATE,
  [Game.FLAGGEN]: DEFAULT_FLAGGEN_STATE,
  [Game.FRAGENHAGEL]: DEFAULT_FRAGENHAGEL_STATE,
  [Game.GEHEIMWOERTER]: GEHEIMWOERTER_ROOM_STATE,
  [Game.MERKEN]: DEFAULT_MERKEN_STATE,
  [Game.SET]: DEFAULT_SET_STATE,
  [Game.ZEHN_SETZEN]: DEFAULT_ZEHN_SETZEN_STATE
};

const GAME_IDENTIFIERS = releasedGames(Object.values(Game));

test.describe("Spiele-Registry", () => {
  for (const { identifier, check, title } of buildGameCases(GAME_IDENTIFIERS)) {
    const game = identifier as keyof typeof DEFAULT_STATES;
    const slug = toKebab(identifier);

    if (check === "picker") {
      test(title, async ({ workerSession }) => {
        const editor = new GameshowEditorPage(workerSession);
        const picker = new GamesPickerPanel(workerSession);
        await editor.goto();
        const button = picker.pickerButton(identifier);
        await expect(
          button,
          `Spiel "${identifier}": Kein Eintrag in der Tabelle games gefunden. Fehlende Prisma-Migration? (slug "${identifier}", active: true)`
        ).toBeVisible();
        await expect(
          button,
          `Spiel "${identifier}": Eintrag in der Tabelle games ist inaktiv. Prisma-Migration prüfen (active: true)`
        ).toBeEnabled();
      });
    }

    if (check === "configurator") {
      test(title, async ({ workerSession }) => {
        const errors = trackBrowserErrors(workerSession);
        const editor = new GameshowEditorPage(workerSession);
        await editor.goto();
        await editor.addGame(identifier);
        await editor.next();
        await expect(
          workerSession.getByRole("heading", { name: /^Einstellungen - / }),
          `Spiel "${identifier}": Konfigurator wird nicht angezeigt`
        ).toBeVisible();
        const pageErrors = errors.errors.filter((e) => e.type === "pageerror");
        expect(
          pageErrors,
          `Spiel "${identifier}": ${errors.format()}`
        ).toHaveLength(0);
      });
    }

    if (check === "room") {
      test(title, async ({ workerSession, tracker }) => {
        test.setTimeout(ROOM_TEST_TIMEOUT_MS);
        const errors = trackBrowserErrors(workerSession);
        const state = DEFAULT_STATES[game];
        const gameshowName = createE2eName();
        const gameshow = await createGameshowViaApi(workerSession.request, {
          name: gameshowName,
          games: [state]
        });
        tracker.trackGameshow(gameshow.id);

        const list = new GameshowListPage(workerSession);
        await list.goto();
        await list.createRoom(gameshowName);
        const dialog = workerSession.getByRole("dialog");
        await dialog.getByLabel("Raumname").fill(createE2eName());
        await dialog.getByRole("button", { name: "Raum erstellen" }).click();
        await workerSession.waitForURL(/\/room\/[^/]+$/);
        const roomId = workerSession.url().split("/room/")[1];
        if (roomId) tracker.trackRoom(roomId);

        const room = new RoomPage(workerSession);
        await room.waitForRoomLoaded();
        const modPanel = new ModPanel(workerSession);
        await modPanel.open();
        await modPanel.startGame(state.name);
        await workerSession.keyboard.press("Escape");

        await expect(
          room.game(slug),
          `Spiel "${identifier}": Element game-${slug} wird im Room nicht gerendert`
        ).toBeVisible({ timeout: GAME_AREA_TIMEOUT_MS });
        await expect(
          room.gameArea.getByText("Spiel nicht gefunden"),
          `Spiel "${identifier}": nicht in GENERATED_PLUGINS registriert (Spiel nicht gefunden)`
        ).toHaveCount(0);
        const pageErrors = errors.errors.filter((e) => e.type === "pageerror");
        expect(
          pageErrors,
          `Spiel "${identifier}": ${errors.format()}`
        ).toHaveLength(0);
      });
    }
  }
});
