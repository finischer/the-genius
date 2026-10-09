import type { Locator, Page } from "@playwright/test";

export type TAdminSection = "users" | "feedbacks" | "betauser";

export class AdminPage {
  readonly deniedAlert: Locator;
  readonly table: Locator;

  constructor(private readonly page: Page) {
    this.deniedAlert = page
      .getByRole("alert")
      .filter({ hasText: "Du darfst auf diese Seite nicht zugreifen" });
    this.table = page.getByRole("table");
  }

  async goto(section: TAdminSection = "users"): Promise<void> {
    await this.page.goto(`/admin/${section}`);
  }
}
