import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

export class GameshowEditorPage {
  constructor(private page: Page) {}

  async goto(gameshowId: string) {
    await this.page.goto(`/gameshows/${gameshowId}`);
  }

  async setName(name: string) {
    await this.page.fill('[data-testid="gameshow-name-input"]', name);
  }

  async save() {
    await this.page.click('[data-testid="save-gameshow-btn"]');
  }

  async addGame(gameIdentifier: string) {
    await this.page.click('[data-testid="games-picker-btn"]');
    await this.page
      .locator(`[data-game-id="${gameIdentifier}"]`)
      .click();
  }

  async getGameListItems() {
    return this.page.locator('[data-testid="game-list-item"]').all();
  }
}
