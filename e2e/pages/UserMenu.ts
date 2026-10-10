import type { Locator, Page } from "@playwright/test";

export class UserMenu {
  readonly trigger: Locator;
  readonly logoutItem: Locator;

  constructor(page: Page) {
    this.trigger = page.getByTestId("user-card-menu");
    this.logoutItem = page.getByRole("menuitem", { name: "Ausloggen" });
  }

  async logout(): Promise<void> {
    await this.trigger.click();
    await this.logoutItem.click();
  }
}
