import { test, expect } from "../fixtures/index";

/**
 * Runs the full gameshow creation flow through the stepper and returns the
 * gameshow ID extracted from the post-save URL (/gameshows/<id>).
 * Assumes the page is already on /gameshows when called.
 */
async function createGameshowViaUI(
  page: import("@playwright/test").Page,
  name: string
): Promise<string> {
  await page.click('[data-testid="create-gameshow-btn"]');
  await page.waitForURL("**/gameshows/create**");

  // Step 0: pick the first available game
  await page
    .locator('[data-testid="games-picker-btn"]:not([disabled])')
    .first()
    .click({ timeout: 5000 });

  await page.click('[data-testid="stepper-next-btn"]');

  // Advance through per-game configurator steps until the details step
  const nameInput = page.locator('[data-testid="gameshow-name-input"]');
  while (!(await nameInput.isVisible({ timeout: 500 }).catch(() => false))) {
    await page.click('[data-testid="stepper-next-btn"]');
  }

  await nameInput.fill(name);
  await page.click('[data-testid="stepper-next-btn"]');
  await page.click('[data-testid="save-gameshow-btn"]');

  // Wait for redirect to /gameshows or /gameshows/<id>
  await page.waitForURL(/\/gameshows/, { timeout: 5000 });

  // Extract the gameshow ID from the final URL if present
  const match = page.url().match(/\/gameshows\/([^/?#]+)/);
  return match?.[1] ?? "";
}

test.describe("Gameshow-Konfigurator", () => {
  // Task 7.1 – Requirement 4.1
  test("Gameshow erstellen und in Dashboard sehen", async ({
    authenticatedContext
  }) => {
    const page = await authenticatedContext.newPage();

    const uniqueName = `E2E Spielshow ${Date.now()}`;

    await page.goto("/gameshows");

    await page.click('[data-testid="create-gameshow-btn"]');
    await page.waitForURL("**/gameshows/create**");

    await page
      .locator('[data-testid="games-picker-btn"]:not([disabled])')
      .first()
      .click({ timeout: 5000 });

    await page.click('[data-testid="stepper-next-btn"]');

    const nameInput = page.locator('[data-testid="gameshow-name-input"]');
    while (!(await nameInput.isVisible({ timeout: 500 }).catch(() => false))) {
      await page.click('[data-testid="stepper-next-btn"]');
    }

    await nameInput.fill(uniqueName);
    await page.click('[data-testid="stepper-next-btn"]');
    await page.click('[data-testid="save-gameshow-btn"]');

    await page.waitForURL("**/gameshows", { timeout: 5000 });

    // The new gameshow must appear in the list within 3 seconds (Requirement 4.1)
    await expect(
      page.locator('[data-testid="gameshow-card"]', { hasText: uniqueName })
    ).toBeVisible({ timeout: 3000 });

    await page.close();
  });

  // Task 7.2 – Requirement 4.2
  test("Spiel via GamesPicker zu Gameshow hinzufügen", async ({
    authenticatedContext
  }) => {
    const page = await authenticatedContext.newPage();
    let gameshowId = "";

    try {
      await page.goto("/gameshows");

      await page.click('[data-testid="create-gameshow-btn"]');
      await page.waitForURL("**/gameshows/create**");

      // Step 0: click the first available game in the picker
      await page
        .locator('[data-testid="games-picker-btn"]:not([disabled])')
        .first()
        .click({ timeout: 5000 });

      // The game should now appear in the game list within 3 seconds (Requirement 4.2)
      await expect(
        page.locator('[data-testid="game-list-item"]').first()
      ).toBeVisible({ timeout: 3000 });

      // Save the gameshow so we can clean up
      await page.click('[data-testid="stepper-next-btn"]');

      const nameInput = page.locator('[data-testid="gameshow-name-input"]');
      while (
        !(await nameInput.isVisible({ timeout: 500 }).catch(() => false))
      ) {
        await page.click('[data-testid="stepper-next-btn"]');
      }

      await nameInput.fill(`E2E Spielpicker Test ${Date.now()}`);
      await page.click('[data-testid="stepper-next-btn"]');
      await page.click('[data-testid="save-gameshow-btn"]');

      await page.waitForURL(/\/gameshows/, { timeout: 5000 });
      const match = page.url().match(/\/gameshows\/([^/?#]+)/);
      gameshowId = match?.[1] ?? "";
    } finally {
      if (gameshowId) {
        await authenticatedContext.request.post(
          "/api/trpc/gameshows.delete",
          {
            data: { json: { gameshowId } },
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      await page.close();
    }
  });

  // Task 7.3 – Requirement 4.3
  test("Gameshow-Name und Spielliste bleiben nach Reload erhalten", async ({
    authenticatedContext
  }) => {
    const page = await authenticatedContext.newPage();
    const uniqueName = `E2E Persistenz ${Date.now()}`;
    let gameshowId = "";

    try {
      await page.goto("/gameshows");
      gameshowId = await createGameshowViaUI(page, uniqueName);

      // Navigate directly to the gameshow editor
      await page.goto(`/gameshows/${gameshowId}`);

      // Reload the page
      await page.reload();

      // The name input should still show the saved name (Requirement 4.3)
      const nameInput = page.locator('[data-testid="gameshow-name-input"]');
      await expect(nameInput).toBeVisible({ timeout: 5000 });
      await expect(nameInput).toHaveValue(uniqueName, { timeout: 3000 });

      // At least one game-list-item should still be present after reload
      await expect(
        page.locator('[data-testid="game-list-item"]').first()
      ).toBeVisible({ timeout: 3000 });
    } finally {
      if (gameshowId) {
        await authenticatedContext.request.post(
          "/api/trpc/gameshows.delete",
          {
            data: { json: { gameshowId } },
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      await page.close();
    }
  });

  // Task 7.4 – Requirement 4.4
  test("Validierungsfehler bei fehlendem Gameshow-Namen", async ({
    authenticatedContext
  }) => {
    const page = await authenticatedContext.newPage();

    try {
      await page.goto("/gameshows");

      await page.click('[data-testid="create-gameshow-btn"]');
      await page.waitForURL("**/gameshows/create**");

      // Select a game so we can advance past the first step
      await page
        .locator('[data-testid="games-picker-btn"]:not([disabled])')
        .first()
        .click({ timeout: 5000 });

      await page.click('[data-testid="stepper-next-btn"]');

      // Advance through per-game configurator steps to the details step
      const nameInput = page.locator('[data-testid="gameshow-name-input"]');
      while (
        !(await nameInput.isVisible({ timeout: 500 }).catch(() => false))
      ) {
        await page.click('[data-testid="stepper-next-btn"]');
      }

      // Clear the name field (it may have a default value)
      await nameInput.clear();

      // Try to advance / save — this should trigger inline validation (Requirement 4.4)
      await page.click('[data-testid="stepper-next-btn"]');

      // An inline validation error must be visible adjacent to the name field
      // Mantine renders error text in a sibling element with role="alert" or
      // a [data-error] / .mantine-InputWrapper-error class.
      const validationError = page.locator(
        '[data-testid="gameshow-name-input"] ~ *, ' +
          '[data-testid="gameshow-name-input"] + *, ' +
          '[class*="InputWrapper"] [class*="error"], ' +
          '[class*="error"]:near([data-testid="gameshow-name-input"])'
      );

      await expect(validationError.first()).toBeVisible({ timeout: 3000 });

      // The page must remain on the details step — save button should NOT have
      // been triggered, so we must NOT be on /gameshows (list)
      expect(page.url()).not.toMatch(/\/gameshows$/);
    } finally {
      await page.close();
    }
  });
});
