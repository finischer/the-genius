import type { Locator, Page } from "@playwright/test";

export class SignInPage {
  readonly heading: Locator;
  readonly googleButton: Locator;
  readonly discordButton: Locator;
  readonly errorAlert: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole("heading", { name: "Willkommen zurück!" });
    this.googleButton = page.getByRole("button", {
      name: "Mit Google fortfahren"
    });
    this.discordButton = page.getByRole("button", {
      name: "Mit Discord einloggen"
    });
    this.errorAlert = page.getByRole("alert");
  }

  async goto(): Promise<void> {
    await this.page.goto("/auth/signin");
  }
}
