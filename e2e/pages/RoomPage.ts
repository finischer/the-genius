import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

export class RoomPage {
  constructor(private page: Page) {}

  async goto(roomId: string) {
    await this.page.goto(`/room/${roomId}`);
  }

  async waitForRoomLoaded() {
    await expect(this.page.locator('[data-testid="room-header"]')).toBeVisible({
      timeout: 5000
    });
    await expect(this.page.locator(".scorebar")).toHaveCount(2, {
      timeout: 5000
    });
    await expect(this.page.locator('[data-testid="room-footer"]')).toBeVisible({
      timeout: 5000
    });
  }

  async openModPanel() {
    await this.page.locator('[data-testid="mod-panel-btn"]').click();
    await expect(this.page.locator(".mod-panel-explanation")).toBeVisible({
      timeout: 2000
    });
  }

  async expandStartGameAccordion() {
    const accordion = this.page.locator(".mod-panel-start-games-accordion");
    await expect(accordion).toBeVisible({ timeout: 2000 });
    // Expand the accordion item if it is not already open
    const panel = accordion.locator(".mantine-Accordion-panel");
    const isVisible = await panel.isVisible().catch(() => false);
    if (!isVisible) {
      await accordion.locator(".mantine-Accordion-control").click();
      await expect(panel).toBeVisible({ timeout: 2000 });
    }
  }

  /**
   * Click the game button for a specific game (by display name) inside the
   * "Spiel starten" accordion. Throws if the button is not found within the
   * timeout.
   */
  async activateGameByName(displayName: string, timeout = 3000): Promise<void> {
    await this.expandStartGameAccordion();
    const panel = this.page.locator(
      ".mod-panel-start-games-accordion .mantine-Accordion-panel"
    );
    const gameBtn = panel
      .locator(".mantine-ButtonGroup")
      .filter({ hasText: displayName })
      .locator(".mantine-Button-root")
      .first();
    await expect(gameBtn).toBeVisible({ timeout });
    await gameBtn.click();
  }

  /**
   * Click the first available (non-disabled) game button inside the "Spiel starten"
   * accordion. Returns the game name from the button label.
   */
  async activateFirstGame(): Promise<string> {
    await this.expandStartGameAccordion();
    const panel = this.page
      .locator(".mod-panel-start-games-accordion .mantine-Accordion-panel");
    // Each game is a Button.Group; click the main (first) button of the first group
    const firstGameBtn = panel.locator(".mantine-ButtonGroup").first()
      .locator(".mantine-Button-root").first();
    const label = (await firstGameBtn.innerText()).trim();
    await firstGameBtn.click();
    return label;
  }

  /**
   * After activating a game, the ModPanel button for that game becomes disabled
   * and gains the "(Läuft gerade)" suffix. This is the "active game indicator"
   * that updates within 2 seconds of activation (Requirement 5.3).
   */
  async waitForActiveGameIndicator(gameName: string, timeout = 2000) {
    const panel = this.page
      .locator(".mod-panel-start-games-accordion .mantine-Accordion-panel");
    // The active game button shows "{name} (Läuft gerade)"
    await expect(
      panel.locator(".mantine-Button-root")
        .filter({ hasText: `${gameName}` })
        .filter({ hasText: "(Läuft gerade)" })
    ).toBeVisible({ timeout });
  }

  async pressBuzzerViaSpacebar() {
    await this.page.keyboard.press("Space");
  }

  async pressBuzzerViaButton() {
    await this.page.locator('[data-testid="buzzer-btn"]').click();
  }

  teamHighlight(teamId: "teamOne" | "teamTwo") {
    return this.page.locator(
      `[data-testid="scorebar-${teamId}"] .scorebar-highlight`
    );
  }

  buzzerBadge(teamId: "teamOne" | "teamTwo") {
    return this.page.locator(
      `[data-testid="scorebar-${teamId}"] .mantine-Badge-root`
    );
  }
}
