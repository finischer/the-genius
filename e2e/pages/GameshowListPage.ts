import type { Locator, Page } from "@playwright/test";

export class GameshowListPage {
  readonly createButton: Locator;
  readonly rows: Locator;
  readonly confirmDialog: Locator;

  constructor(private readonly page: Page) {
    this.createButton = page.getByTestId("create-gameshow-btn");
    this.rows = page.getByTestId("gameshow-card");
    this.confirmDialog = page.getByRole("dialog");
  }

  async goto(): Promise<void> {
    await this.page.goto("/gameshows");
  }

  row(name: string): Locator {
    return this.rows.filter({ hasText: name });
  }

  actionMenu(name: string): Locator {
    return this.row(name).getByTestId("gameshow-action-menu");
  }

  createRoomButton(name: string): Locator {
    return this.row(name).getByTestId("gameshow-create-room-btn");
  }

  async createRoom(name: string): Promise<void> {
    await this.createRoomButton(name).click();
  }

  async openEdit(name: string): Promise<void> {
    await this.actionMenu(name).click();
    await this.page.getByRole("menuitem", { name: "Bearbeiten" }).click();
  }

  async delete(name: string): Promise<void> {
    await this.actionMenu(name).click();
    await this.page.getByRole("menuitem", { name: "Löschen" }).click();
    await this.confirmDialog
      .getByRole("button", { name: "Spielshow löschen" })
      .click();
  }
}
