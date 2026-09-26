import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

export class DashboardPage {
  constructor(private page: Page) {}

  async goto(userId: string) {
    await this.page.goto(`/dashboard/${userId}`);
  }

  async waitForLoaded() {
    await expect(
      this.page.locator("h1, [data-testid='dashboard-header']")
    ).toBeVisible({
      timeout: 3000
    });
  }

  async getGameshowCards() {
    return this.page.locator('[data-testid="gameshow-card"]').all();
  }

  async findGameshowByName(name: string) {
    return this.page.locator(
      `[data-testid="gameshow-card"]:has-text("${name}")`
    );
  }

  async createGameshow(name: string) {
    await this.page.click('[data-testid="create-gameshow-btn"]');
    await this.page.fill('[data-testid="gameshow-name-input"]', name);
    await this.page.click('[data-testid="confirm-create-btn"]');
  }
}
