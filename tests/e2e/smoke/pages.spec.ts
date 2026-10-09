import type { Page } from "@playwright/test";
import { expect, test } from "../../../e2e/fixtures";
import {
  formatBrowserErrors,
  trackBrowserErrors
} from "../../../e2e/helpers/browserErrors";

const LOAD_TIMEOUT = 10_000;
const MISSING_PATH = "/diese-seite-existiert-nicht";

const PUBLIC_PATHS = ["/impressum", "/datenschutz", "/auth/signin"] as const;
const USER_PATHS = [
  "/",
  "/rooms",
  "/gameshows",
  "/gameshows/create",
  "/settings"
] as const;
const PROTECTED_PATHS = USER_PATHS;

async function expectHealthyPage(page: Page, path: string): Promise<void> {
  const tracker = trackBrowserErrors(page);
  const response = await page.goto(path, {
    waitUntil: "load",
    timeout: LOAD_TIMEOUT
  });
  expect(response?.status(), `HTTP-Status von ${path}`).toBe(200);
  await page.waitForLoadState("networkidle", { timeout: LOAD_TIMEOUT });
  // nextjs-portal is always present in dev mode; only the error dialog matters
  await expect(page.locator("[data-nextjs-dialog]")).toHaveCount(0);
  await expect(page.getByText("Application error")).toHaveCount(0);
  expect(tracker.errors, formatBrowserErrors(path, tracker.errors)).toEqual([]);
}

test.describe("Smoke: Seiten", { tag: "@smoke" }, () => {
  for (const path of PUBLIC_PATHS) {
    test(`öffentliche Seite ${path} lädt fehlerfrei`, async ({ page }) => {
      await expectHealthyPage(page, path);
      await expect(page).toHaveURL(new RegExp(`${path}$`));
    });
  }

  for (const path of USER_PATHS) {
    test(`geschützte Seite ${path} lädt als USER ohne Weiterleitung`, async ({
      userSession
    }) => {
      await expectHealthyPage(userSession, path);
      expect(new URL(userSession.url()).pathname).toBe(path);
    });
  }

  test("nicht existierende URL zeigt die 404-Seite", async ({ page }) => {
    const tracker = trackBrowserErrors(page);
    const response = await page.goto(MISSING_PATH, {
      waitUntil: "load",
      timeout: LOAD_TIMEOUT
    });
    expect(response?.status(), `HTTP-Status von ${MISSING_PATH}`).toBe(404);
    await expect(page.getByAltText("error-404")).toBeVisible();
    // The browser logs the 404 document response itself as a console error
    const unexpected = tracker.errors.filter(
      (error) =>
        !(
          error.type === "console" &&
          error.text.includes("Failed to load resource") &&
          error.text.includes("404")
        )
    );
    expect(unexpected, formatBrowserErrors(MISSING_PATH, unexpected)).toEqual(
      []
    );
  });

  for (const path of PROTECTED_PATHS) {
    test(`anonymer Aufruf von ${path} leitet auf /auth/signin weiter`, async ({
      page
    }) => {
      await page.goto(path, { timeout: LOAD_TIMEOUT });
      await expect(page).toHaveURL(/\/auth\/signin/, {
        timeout: LOAD_TIMEOUT
      });
      const response = await page.reload({ timeout: LOAD_TIMEOUT });
      expect(response?.status(), "HTTP-Status von /auth/signin").toBe(200);
    });
  }
});
