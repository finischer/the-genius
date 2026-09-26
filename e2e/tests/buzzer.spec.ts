import { test, expect } from "../fixtures/index";
import { RoomPage } from "../pages/RoomPage";

/**
 * Joins a team by clicking the "Beitreten" button on the first scorebar that
 * shows a join button. Returns the team ID detected from the data-testid.
 */
async function joinFirstTeam(
  page: import("@playwright/test").Page
): Promise<"teamOne" | "teamTwo"> {
  // Click the first visible "Beitreten" button (rendered in Scorebar for non-players)
  const joinBtn = page
    .locator("button", { hasText: "Beitreten" })
    .first();
  await expect(joinBtn).toBeVisible({ timeout: 5000 });
  await joinBtn.click();

  // Determine which team we joined by checking which scorebar now has a "Team verlassen" button
  const leaveBtn = page.locator("button", { hasText: "Team verlassen" }).first();
  await expect(leaveBtn).toBeVisible({ timeout: 3000 });

  // Figure out team from the parent scorebar data-testid
  const scorebarOne = page.locator('[data-testid="scorebar-teamOne"]');

  const leaveInOne = await scorebarOne
    .locator("button", { hasText: "Team verlassen" })
    .isVisible()
    .catch(() => false);

  return leaveInOne ? "teamOne" : "teamTwo";
}

/**
 * Opens the ModPanel actions accordion to expose buzzer-related buttons.
 */
async function openModPanelActions(
  page: import("@playwright/test").Page
): Promise<void> {
  await page.locator('[data-testid="mod-panel-btn"]').click();
  await expect(page.locator(".mod-panel-explanation")).toBeVisible({
    timeout: 2000
  });

  // Open the "Aktionen" accordion if not already open
  const actionsAccordion = page.locator(".mod-panel-actions-accordion");
  await expect(actionsAccordion).toBeVisible({ timeout: 2000 });

  const actionsPanel = actionsAccordion.locator(
    '[class*="Accordion-panel"]'
  );
  const isPanelVisible = await actionsPanel.isVisible().catch(() => false);
  if (!isPanelVisible) {
    await actionsAccordion.locator('[class*="Accordion-control"]').click();
    await expect(actionsPanel).toBeVisible({ timeout: 2000 });
  }
}

test.describe("Buzzer-Logik", () => {
  // Task 9.1 – Requirement 6.1
  // Spacebar press → Scorebar highlight activates and scorebarTimer starts within 2s
  test("Buzzer-Druck via Spacebar – Highlight und Timer", async ({
    authenticatedContext,
    roomContext
  }) => {
    const page = await authenticatedContext.newPage();

    // Track console errors
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    try {
      const roomPage = new RoomPage(page);
      await roomPage.goto(roomContext.roomId);
      await roomPage.waitForRoomLoaded();

      // Join a team so the buzzer responds to spacebar
      const teamId = await joinFirstTeam(page);

      // Press spacebar to activate the buzzer
      await roomPage.pressBuzzerViaSpacebar();

      // The pressing team's scorebar highlight should now have a non-empty box-shadow
      const highlight = roomPage.teamHighlight(teamId);
      await expect(highlight).toBeVisible({ timeout: 2000 });
      await expect(highlight).toHaveCSS("box-shadow", /[^none]/, {
        timeout: 2000
      });

      // The scorebarTimer Container should appear next to the scorebar within 2s.
      // It renders as an AnimatePresence/motion.div child when team.scorebarTimer.active = true.
      // The Container holds the countdown number and sits inside the scorebar flex.
      const scorebar = page.locator(`[data-testid="scorebar-${teamId}"]`);
      // Match any visible numeric text (countdown seconds) inside the scorebar area
      const timerEl = scorebar.locator("[class*='Container']");
      await expect(timerEl.first()).toBeVisible({ timeout: 2000 });

      // No console errors should have occurred
      expect(consoleErrors).toHaveLength(0);
    } finally {
      await page.close();
    }
  });

  // Task 9.2 – Requirement 6.2
  // Buzzer press → player name Badge appears above the Scorebar within 2s
  test("Spielername-Badge nach Buzzer-Druck", async ({
    authenticatedContext,
    roomContext
  }) => {
    const page = await authenticatedContext.newPage();

    try {
      const roomPage = new RoomPage(page);
      await roomPage.goto(roomContext.roomId);
      await roomPage.waitForRoomLoaded();

      // Join a team so the buzzer button appears
      const teamId = await joinFirstTeam(page);

      // Press buzzer via the button
      await roomPage.pressBuzzerViaButton();

      // A Badge with the player's name should appear within the pressing team's scorebar.
      // The badge is rendered inside ModView (host-only) in scorebar-settings.
      // Since the test user IS the host (room creator), they can see it.
      const badge = roomPage.buzzerBadge(teamId);
      await expect(badge).toBeVisible({ timeout: 2000 });

      // The badge text should be non-empty (player's name or fallback)
      const badgeText = await badge.textContent();
      expect(badgeText?.trim().length).toBeGreaterThan(0);
    } finally {
      await page.close();
    }
  });

  // Task 9.3 – Requirement 6.6
  // Lock all buzzers → buzzer press triggers "Buzzer ist gesperrt!" notification,
  // isActiveTurn remains false (no scorebar highlight)
  test("Buzzer sperren und Info-Notification", async ({
    authenticatedContext,
    roomContext
  }) => {
    const page = await authenticatedContext.newPage();

    try {
      const roomPage = new RoomPage(page);
      await roomPage.goto(roomContext.roomId);
      await roomPage.waitForRoomLoaded();

      // Open mod panel and lock all buzzers first
      await openModPanelActions(page);

      const lockBtn = page.locator("button", {
        hasText: /Alle Buzzer sperren/
      });
      await expect(lockBtn).toBeVisible({ timeout: 2000 });
      await lockBtn.click();

      // Close the mod panel drawer by pressing Escape
      await page.keyboard.press("Escape");
      await expect(page.locator(".mod-panel-explanation")).not.toBeVisible({
        timeout: 2000
      });

      // Join a team so the buzzer button is rendered
      const teamId = await joinFirstTeam(page);

      // Press buzzer — should show locked notification instead of activating
      await roomPage.pressBuzzerViaButton();

      // Expect the "Buzzer ist gesperrt!" info notification to appear
      await expect(
        page.locator("text=Buzzer ist gesperrt!")
      ).toBeVisible({ timeout: 2000 });

      // The scorebar highlight should NOT have an active box-shadow
      // (isActiveTurn should remain false)
      const highlight = roomPage.teamHighlight(teamId);
      await expect(highlight).toBeVisible({ timeout: 1000 });
      const boxShadow = await highlight.evaluate(
        (el) => window.getComputedStyle(el).boxShadow
      );
      // "none" or empty means no active highlight
      expect(boxShadow === "none" || boxShadow === "").toBeTruthy();
    } finally {
      await page.close();
    }
  });

  // Task 9.4 – Requirement 6.4
  // Moderator clicks "Alle Buzzer freigeben" → highlight disappears,
  // scorebarTimer stops, and player name Badge is no longer visible within 2s
  test("Alle Buzzer freigeben (Reset)", async ({
    authenticatedContext,
    roomContext
  }) => {
    const page = await authenticatedContext.newPage();

    try {
      const roomPage = new RoomPage(page);
      await roomPage.goto(roomContext.roomId);
      await roomPage.waitForRoomLoaded();

      // Join a team and press the buzzer to get into an active state
      const teamId = await joinFirstTeam(page);
      await roomPage.pressBuzzerViaButton();

      // Wait for the active state to register (highlight present)
      const highlight = roomPage.teamHighlight(teamId);
      await expect(highlight).toBeVisible({ timeout: 2000 });
      await expect(highlight).toHaveCSS("box-shadow", /[^none]/, {
        timeout: 2000
      });

      // Now open the mod panel and click "Alle Buzzer freigeben"
      await openModPanelActions(page);

      const releaseBtn = page.locator("button", {
        hasText: "Alle Buzzer freigeben"
      });
      await expect(releaseBtn).toBeVisible({ timeout: 2000 });
      await expect(releaseBtn).not.toBeDisabled({ timeout: 1000 });
      await releaseBtn.click();

      // Close the mod panel
      await page.keyboard.press("Escape");

      // The highlight box-shadow should be cleared within 2 seconds
      await expect
        .poll(
          async () => {
            const shadow = await highlight.evaluate(
              (el) => window.getComputedStyle(el).boxShadow
            );
            return shadow === "none" || shadow === "";
          },
          { timeout: 2000 }
        )
        .toBeTruthy();

      // The scorebarTimer should no longer be visible
      const scorebar = page.locator(`[data-testid="scorebar-${teamId}"]`);
      const timerEl = scorebar.locator("[class*='Container']");
      await expect(timerEl.first()).not.toBeVisible({ timeout: 2000 });

      // The player name Badge should no longer be visible
      const badge = roomPage.buzzerBadge(teamId);
      await expect(badge).not.toBeVisible({ timeout: 2000 });
    } finally {
      await page.close();
    }
  });
});
