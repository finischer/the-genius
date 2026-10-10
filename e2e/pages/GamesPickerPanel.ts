import type { Locator, Page } from "@playwright/test";
import { toKebab } from "./toKebab";

export class GamesPickerPanel {
  readonly selectedGames: Locator;

  constructor(private readonly page: Page) {
    this.selectedGames = page.getByTestId("game-list-item");
  }

  pickerButton(gameIdentifier: string): Locator {
    return this.page.getByTestId(`games-picker-btn-${toKebab(gameIdentifier)}`);
  }

  async addGame(gameIdentifier: string): Promise<void> {
    await this.pickerButton(gameIdentifier).click();
  }
}
