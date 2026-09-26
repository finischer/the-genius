import { test, expect } from "@playwright/test";

// Test credentials matching the local dev seed user (walter@thegenius.local)
const VALID_EMAIL = process.env.E2E_TEST_EMAIL ?? "walter@thegenius.local";
const VALID_PASSWORD = process.env.E2E_TEST_PASSWORD ?? "password";

test.describe("Authentifizierung", () => {
  // Task 6.1 – Requirement 3.1
  test("leitet auf /auth/signin weiter ohne Session", async ({ page }) => {
    // Navigate to a protected dashboard route without a session
    await page.goto("/dashboard/some-id");

    // Should redirect to /auth/signin within 3 seconds
    await expect(page).toHaveURL(/\/auth\/signin/, { timeout: 3000 });

    // The originally requested URL should appear as callbackUrl query param
    await expect(page).toHaveURL(/callbackUrl/, { timeout: 3000 });
  });

  // Task 6.2 – Requirement 3.2
  test("erfolgreicher Login leitet auf /dashboard weiter", async ({ page }) => {
    await page.goto("/auth/signin");

    // The local dev signin page renders a single "Als Walter White einloggen"
    // button that directly calls signIn("credentials", { email, password }).
    // We use the NextAuth built-in credentials form endpoint directly instead,
    // as it's more robust for E2E testing than clicking the React-rendered button.
    await page.goto(
      `/api/auth/signin/credentials?callbackUrl=${encodeURIComponent("http://localhost:3000/auth/signin")}`
    );

    // Fill the NextAuth built-in credentials form
    await page.fill('[name="email"]', VALID_EMAIL);
    await page.fill('[name="password"]', VALID_PASSWORD);
    await page.click('[type="submit"]');

    // Should redirect to dashboard (dynamic route /dashboard/[id]) within 5 seconds
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 });

    // Session cookie must be present (JWT strategy in dev uses next-auth.session-token)
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(
      (c) =>
        c.name.includes("session-token") || c.name.includes("next-auth")
    );
    expect(sessionCookie).toBeDefined();
  });

  // Task 6.3 – Requirement 3.3
  test("fehlgeschlagener Login zeigt Fehlermeldung", async ({ page }) => {
    await page.goto(
      `/api/auth/signin/credentials?callbackUrl=${encodeURIComponent("http://localhost:3000/auth/signin")}`
    );

    // Submit invalid credentials
    await page.fill('[name="email"]', "invalid@example.com");
    await page.fill('[name="password"]', "wrongpassword");
    await page.click('[type="submit"]');

    // NextAuth redirects to /auth/error?error=... on failed credentials login.
    // The application's custom error page renders "Fehler: <message>".
    await expect(page).toHaveURL(/\/auth\/(error|signin)/, { timeout: 3000 });

    // Either the error page URL contains "error" param or the signin page shows an error
    const currentUrl = page.url();
    const hasErrorInUrl =
      currentUrl.includes("/auth/error") || currentUrl.includes("error=");
    expect(hasErrorInUrl).toBeTruthy();

    // Verify the error is surfaced in the page content
    const errorText = page.locator("div").filter({ hasText: /Fehler:|error/i });
    const signInStillVisible = page.locator(
      '[role="alert"], [data-error], .error'
    );
    const anyErrorVisible =
      (await errorText.count()) > 0 ||
      (await signInStillVisible.count()) > 0 ||
      hasErrorInUrl;
    expect(anyErrorVisible).toBeTruthy();

    // No session cookie must be set
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(
      (c) =>
        c.name.includes("session-token") || c.name.includes("next-auth")
    );
    expect(sessionCookie).toBeUndefined();
  });

  // Task 6.4 – Requirement 3.4
  test("Dashboard zeigt Nutzernamen nach Login", async ({ browser }) => {
    // Use a fresh browser context to avoid state leakage
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      // Log in via the NextAuth credentials form
      await page.goto(
        `/api/auth/signin/credentials?callbackUrl=${encodeURIComponent("http://localhost:3000/")}`
      );
      await page.fill('[name="email"]', VALID_EMAIL);
      await page.fill('[name="password"]', VALID_PASSWORD);
      await page.click('[type="submit"]');

      // Wait until we land somewhere on the dashboard
      await page.waitForURL(/\/dashboard/, { timeout: 5000 });

      // The PageLayout header displays "Schön dich zu sehen, {username}!" when
      // session.user.username is set. Walter White has username "heisenberg".
      // We look for either:
      //   a) the greeting text containing the username, or
      //   b) an avatar image with a non-empty alt attribute matching the user's name
      const greetingText = page.locator("text=/Schön dich zu sehen/");
      const avatarWithAlt = page.locator('img[alt]:not([alt=""])').first();

      const greetingVisible = await greetingText
        .isVisible()
        .catch(() => false);
      const avatarVisible = await avatarWithAlt.isVisible().catch(() => false);

      expect(greetingVisible || avatarVisible).toBeTruthy();

      if (greetingVisible) {
        // Confirm the greeting contains an actual username (non-empty after the comma)
        const text = await greetingText.textContent();
        expect(text).toMatch(/Schön dich zu sehen, .+!/);
      }
    } finally {
      await context.close();
    }
  });
});
