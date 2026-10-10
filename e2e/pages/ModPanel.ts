import type { Locator, Page } from "@playwright/test";

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export class ModPanel {
  readonly openButton: Locator;
  readonly drawer: Locator;
  readonly startGameControl: Locator;
  readonly startGamePanel: Locator;
  readonly actionsControl: Locator;
  readonly actionsPanel: Locator;
  readonly releaseBuzzersButton: Locator;
  readonly buzzerToggle: Locator;

  constructor(private readonly page: Page) {
    this.openButton = page.getByTestId("mod-panel-btn");
    this.drawer = page.getByRole("dialog", { name: /Mod-Panel/ });
    this.startGameControl = this.drawer.getByRole("button", {
      name: "Spiel starten"
    });
    this.startGamePanel = this.drawer.getByRole("region", {
      name: "Spiel starten"
    });
    this.actionsControl = this.drawer.getByRole("button", { name: "Aktionen" });
    this.actionsPanel = this.drawer.getByRole("region", { name: "Aktionen" });
    this.releaseBuzzersButton = this.drawer.getByRole("button", {
      name: "Alle Buzzer freigeben"
    });
    this.buzzerToggle = this.drawer.getByRole("button", {
      name: /Alle Buzzer (sperren|entsperren)/
    });
  }

  async open(): Promise<void> {
    await this.openButton.click();
    await this.drawer.waitFor({ state: "visible" });
  }

  async close(): Promise<void> {
    await this.page.keyboard.press("Escape");
    await this.drawer.waitFor({ state: "hidden" });
  }

  async expandStartGames(): Promise<void> {
    if (await this.startGamePanel.isVisible()) return;
    await this.startGameControl.click();
    await this.startGamePanel.waitFor({ state: "visible" });
  }

  async expandActions(): Promise<void> {
    if (await this.actionsPanel.isVisible()) return;
    await this.actionsControl.click();
    await this.actionsPanel.waitFor({ state: "visible" });
  }

  async toggleBuzzerLock(): Promise<void> {
    await this.expandActions();
    await this.buzzerToggle.click();
  }

  async releaseBuzzers(): Promise<void> {
    await this.expandActions();
    await this.releaseBuzzersButton.click();
  }

  gameButton(displayName: string): Locator {
    return this.startGamePanel.getByRole("button", {
      name: new RegExp(`^${escapeRegExp(displayName)}`)
    });
  }

  activeGameButton(displayName: string): Locator {
    return this.startGamePanel.getByRole("button", {
      name: new RegExp(`^${escapeRegExp(displayName)}.*\\(Läuft gerade\\)`)
    });
  }

  async startGame(displayName: string): Promise<void> {
    await this.expandStartGames();
    await this.gameButton(displayName).first().click();
  }

  async startFirstGame(): Promise<string> {
    await this.expandStartGames();
    const first = this.startGamePanel.getByRole("button").first();
    const label = (await first.innerText()).trim();
    await first.click();
    return label;
  }
}
