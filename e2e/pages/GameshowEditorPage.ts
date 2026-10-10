import type { Locator, Page } from "@playwright/test";
import { GamesPickerPanel } from "./GamesPickerPanel";

export class GameshowEditorPage {
  readonly nameInput: Locator;
  readonly nextButton: Locator;
  readonly prevButton: Locator;
  readonly saveButton: Locator;
  readonly gamesPicker: GamesPickerPanel;

  constructor(private readonly page: Page) {
    this.nameInput = page.getByLabel("Name der Spielshow");
    this.nextButton = page.getByTestId("stepper-next-btn");
    this.prevButton = page.getByTestId("stepper-prev-btn");
    this.saveButton = page.getByRole("button", { name: "Speichern" });
    this.gamesPicker = new GamesPickerPanel(page);
  }

  async goto(gameshowId?: string): Promise<void> {
    const url = gameshowId
      ? `/gameshows/create?gameshowId=${encodeURIComponent(gameshowId)}&action=update`
      : "/gameshows/create";
    await this.page.goto(url);
  }

  settingsHeading(gameName: string): Locator {
    return this.page.getByRole("heading", {
      name: `Einstellungen - ${gameName}`
    });
  }

  gameListItems(): Locator {
    return this.gamesPicker.selectedGames;
  }

  async setName(name: string): Promise<void> {
    await this.nameInput.fill(name);
  }

  async next(): Promise<void> {
    await this.nextButton.click();
  }

  async previous(): Promise<void> {
    await this.prevButton.click();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async addGame(gameIdentifier: string): Promise<void> {
    await this.gamesPicker.addGame(gameIdentifier);
  }
}
