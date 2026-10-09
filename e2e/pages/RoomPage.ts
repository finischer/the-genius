import type { Locator, Page } from "@playwright/test";
import { ModPanel } from "./ModPanel";
import { ScorebarPanel } from "./ScorebarPanel";

const GAME_START_TIMEOUT_MS = 10_000;

type TTeamId = "teamOne" | "teamTwo";

export class RoomPage {
  readonly header: Locator;
  readonly footer: Locator;
  readonly gameArea: Locator;
  readonly buzzerButton: Locator;
  readonly guestDialog: Locator;
  readonly guestUsernameInput: Locator;
  readonly guestJoinButton: Locator;
  readonly modPanel: ModPanel;
  readonly teamOne: ScorebarPanel;
  readonly teamTwo: ScorebarPanel;

  constructor(private readonly page: Page) {
    this.header = page.getByTestId("room-header");
    this.footer = page.getByTestId("room-footer");
    this.gameArea = page.getByTestId("game-area");
    this.buzzerButton = page.getByTestId("buzzer-btn");
    this.guestDialog = page.getByRole("dialog");
    this.guestUsernameInput = this.guestDialog.getByLabel("Username");
    this.guestJoinButton = this.guestDialog.getByRole("button", {
      name: "Beitreten"
    });
    this.modPanel = new ModPanel(page);
    this.teamOne = new ScorebarPanel(page, "team-one");
    this.teamTwo = new ScorebarPanel(page, "team-two");
  }

  async goto(roomId: string): Promise<void> {
    await this.page.goto(`/room/${roomId}`);
  }

  game(slug: string): Locator {
    return this.gameArea.getByTestId(`game-${slug}`);
  }

  team(teamId: TTeamId): ScorebarPanel {
    return teamId === "teamOne" ? this.teamOne : this.teamTwo;
  }

  async joinAsGuest(username: string): Promise<void> {
    await this.guestUsernameInput.fill(username);
    await this.guestJoinButton.click();
  }

  async pressBuzzerViaButton(): Promise<void> {
    await this.buzzerButton.click();
  }

  async pressBuzzerViaSpacebar(): Promise<void> {
    await this.page.keyboard.press("Space");
  }

  buzzerBadge(teamId: TTeamId): Locator {
    return this.team(teamId).buzzerBadge;
  }

  async startGame(displayName: string): Promise<void> {
    await this.modPanel.open();
    await this.modPanel.startGame(displayName);
    await this.modPanel.activeGameButton(displayName).waitFor({
      state: "visible"
    });
    await this.modPanel.close();
    // Without the intro (see e2e/helpers/gameIntro.ts) the game renders right away
    await this.gameArea
      .locator('[data-testid^="game-"]')
      .first()
      .waitFor({ state: "visible", timeout: GAME_START_TIMEOUT_MS });
  }

  // Compatibility wrappers for specs migrated in task 8.1
  async waitForRoomLoaded(): Promise<void> {
    await this.header.waitFor({ state: "visible" });
    await this.teamOne.root.waitFor({ state: "visible" });
    await this.teamTwo.root.waitFor({ state: "visible" });
    await this.footer.waitFor({ state: "visible" });
  }

  async openModPanel(): Promise<void> {
    await this.modPanel.open();
  }

  async expandStartGameAccordion(): Promise<void> {
    await this.modPanel.expandStartGames();
  }

  async activateGameByName(
    displayName: string,
    _timeout?: number
  ): Promise<void> {
    await this.modPanel.startGame(displayName);
  }

  async activateFirstGame(): Promise<string> {
    return this.modPanel.startFirstGame();
  }

  async waitForActiveGameIndicator(
    gameName: string,
    timeout?: number
  ): Promise<void> {
    await this.modPanel.activeGameButton(gameName).waitFor({
      state: "visible",
      timeout
    });
  }
}
