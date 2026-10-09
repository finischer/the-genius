import { test as base } from "@playwright/test";
import { AdminPage } from "../pages/AdminPage";
import { GamesPickerPanel } from "../pages/GamesPickerPanel";
import { GameshowEditorPage } from "../pages/GameshowEditorPage";
import { GameshowListPage } from "../pages/GameshowListPage";
import { ModPanel } from "../pages/ModPanel";
import { RoomPage } from "../pages/RoomPage";
import { ScorebarPanel } from "../pages/ScorebarPanel";
import { SignInPage } from "../pages/SignInPage";
import { UserMenu } from "../pages/UserMenu";

type PageFixtures = {
  signInPage: SignInPage;
  gameshowListPage: GameshowListPage;
  gameshowEditorPage: GameshowEditorPage;
  gamesPicker: GamesPickerPanel;
  roomPage: RoomPage;
  modPanel: ModPanel;
  scorebarTeamOne: ScorebarPanel;
  scorebarTeamTwo: ScorebarPanel;
  adminArea: AdminPage;
  userMenu: UserMenu;
};

export const test = base.extend<PageFixtures>({
  signInPage: async ({ page }, use) => {
    await use(new SignInPage(page));
  },
  gameshowListPage: async ({ page }, use) => {
    await use(new GameshowListPage(page));
  },
  gameshowEditorPage: async ({ page }, use) => {
    await use(new GameshowEditorPage(page));
  },
  gamesPicker: async ({ page }, use) => {
    await use(new GamesPickerPanel(page));
  },
  roomPage: async ({ page }, use) => {
    await use(new RoomPage(page));
  },
  modPanel: async ({ page }, use) => {
    await use(new ModPanel(page));
  },
  scorebarTeamOne: async ({ page }, use) => {
    await use(new ScorebarPanel(page, "team-one"));
  },
  scorebarTeamTwo: async ({ page }, use) => {
    await use(new ScorebarPanel(page, "team-two"));
  },
  adminArea: async ({ page }, use) => {
    await use(new AdminPage(page));
  },
  userMenu: async ({ page }, use) => {
    await use(new UserMenu(page));
  }
});

export { expect } from "@playwright/test";
