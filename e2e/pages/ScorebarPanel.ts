import type { Locator, Page } from "@playwright/test";

export type TTeamSuffix = "team-one" | "team-two";

export class ScorebarPanel {
  readonly root: Locator;
  readonly score: Locator;
  readonly teamName: Locator;
  readonly buzzerBadge: Locator;
  readonly incrementButton: Locator;
  readonly decrementButton: Locator;
  readonly joinButton: Locator;
  readonly leaveButton: Locator;

  constructor(page: Page, team: TTeamSuffix) {
    this.root = page.getByTestId(`scorebar-${team}`);
    this.score = this.root.getByTestId(`scorebar-score-${team}`);
    this.teamName = this.root.getByTestId(`scorebar-team-name-${team}`);
    this.buzzerBadge = this.root.getByTestId(`scorebar-buzzer-badge-${team}`);
    this.incrementButton = this.root.getByTestId("scorebar-score-inc");
    this.decrementButton = this.root.getByTestId("scorebar-score-dec");
    this.joinButton = this.root.getByRole("button", { name: "Beitreten" });
    this.leaveButton = this.root.getByRole("button", {
      name: "Team verlassen"
    });
  }

  async increment(): Promise<void> {
    await this.incrementButton.click();
  }

  async decrement(): Promise<void> {
    await this.decrementButton.click();
  }

  async join(): Promise<void> {
    await this.joinButton.click();
  }

  async leave(): Promise<void> {
    await this.leaveButton.click();
  }
}
