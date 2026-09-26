import { test as base, type BrowserContext } from "@playwright/test";
import path from "path";
import fs from "fs";

type AuthFixtures = {
  authenticatedContext: BrowserContext;
};

export const test = base.extend<AuthFixtures>({
  authenticatedContext: async ({ browser }, use, workerInfo) => {
    const storageFile = path.join(
      "e2e/.auth",
      `worker-${workerInfo.workerIndex}.json`
    );

    if (!fs.existsSync(storageFile)) {
      // Login flow - run once per worker via the NextAuth built-in credentials form.
      // The custom /auth/signin page only shows a single "Als Walter White einloggen"
      // button (no email/password fields), so we use the NextAuth endpoint directly.
      const email = process.env.E2E_TEST_EMAIL ?? "walter@thegenius.local";
      const password = process.env.E2E_TEST_PASSWORD ?? "password";

      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(
        `/api/auth/signin/credentials?callbackUrl=${encodeURIComponent("http://localhost:3000/auth/signin")}`
      );
      await page.fill('[name="email"]', email);
      await page.fill('[name="password"]', password);
      await page.click('[type="submit"]');
      await page.waitForURL(/\/dashboard/, { timeout: 10000 });
      await context.storageState({ path: storageFile });
      await context.close();
    }

    const context = await browser.newContext({ storageState: storageFile });
    await use(context);
    await context.close();
  }
});

export { expect } from "@playwright/test";
