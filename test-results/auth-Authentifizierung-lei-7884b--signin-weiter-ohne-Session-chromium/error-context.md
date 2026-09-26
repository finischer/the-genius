# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentifizierung >> leitet auf /auth/signin weiter ohne Session
- Location: e2e/tests/auth.spec.ts:9:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /callbackUrl/
Received string:  "http://localhost:3000/auth/signin"
Timeout: 3000ms

Call log:
  - Expect "toHaveURL" with timeout 3000ms
    10 × locator resolved to <html lang="en" data-mantine-color-scheme="dark">…</html>
       - unexpected value "http://localhost:3000/auth/signin"

```

```yaml
- img "the-genius-logo"
- paragraph: The Genius
- heading "Willkommen zurück!" [level=2]
- button "Als Walter White einloggen"
- link "Impressum":
  - /url: /impressum
  - paragraph: Impressum
- link "Datenschutz":
  - /url: /datenschutz
  - paragraph: Datenschutz
- button "Open Next.js Dev Tools":
  - img
- alert: TheGenius
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | // Test credentials matching the local dev seed user (walter@thegenius.local)
  4   | const VALID_EMAIL = process.env.E2E_TEST_EMAIL ?? "walter@thegenius.local";
  5   | const VALID_PASSWORD = process.env.E2E_TEST_PASSWORD ?? "password";
  6   | 
  7   | test.describe("Authentifizierung", () => {
  8   |   // Task 6.1 – Requirement 3.1
  9   |   test("leitet auf /auth/signin weiter ohne Session", async ({ page }) => {
  10  |     // Navigate to a protected dashboard route without a session
  11  |     await page.goto("/dashboard/some-id");
  12  | 
  13  |     // Should redirect to /auth/signin within 3 seconds
  14  |     await expect(page).toHaveURL(/\/auth\/signin/, { timeout: 3000 });
  15  | 
  16  |     // The originally requested URL should appear as callbackUrl query param
> 17  |     await expect(page).toHaveURL(/callbackUrl/, { timeout: 3000 });
      |                        ^ Error: expect(page).toHaveURL(expected) failed
  18  |   });
  19  | 
  20  |   // Task 6.2 – Requirement 3.2
  21  |   test("erfolgreicher Login leitet auf /dashboard weiter", async ({ page }) => {
  22  |     await page.goto("/auth/signin");
  23  | 
  24  |     // The local dev signin page renders a single "Als Walter White einloggen"
  25  |     // button that directly calls signIn("credentials", { email, password }).
  26  |     // We use the NextAuth built-in credentials form endpoint directly instead,
  27  |     // as it's more robust for E2E testing than clicking the React-rendered button.
  28  |     await page.goto(
  29  |       `/api/auth/signin/credentials?callbackUrl=${encodeURIComponent("http://localhost:3000/auth/signin")}`
  30  |     );
  31  | 
  32  |     // Fill the NextAuth built-in credentials form
  33  |     await page.fill('[name="email"]', VALID_EMAIL);
  34  |     await page.fill('[name="password"]', VALID_PASSWORD);
  35  |     await page.click('[type="submit"]');
  36  | 
  37  |     // Should redirect to dashboard (dynamic route /dashboard/[id]) within 5 seconds
  38  |     await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 });
  39  | 
  40  |     // Session cookie must be present (JWT strategy in dev uses next-auth.session-token)
  41  |     const cookies = await page.context().cookies();
  42  |     const sessionCookie = cookies.find(
  43  |       (c) =>
  44  |         c.name.includes("session-token") || c.name.includes("next-auth")
  45  |     );
  46  |     expect(sessionCookie).toBeDefined();
  47  |   });
  48  | 
  49  |   // Task 6.3 – Requirement 3.3
  50  |   test("fehlgeschlagener Login zeigt Fehlermeldung", async ({ page }) => {
  51  |     await page.goto(
  52  |       `/api/auth/signin/credentials?callbackUrl=${encodeURIComponent("http://localhost:3000/auth/signin")}`
  53  |     );
  54  | 
  55  |     // Submit invalid credentials
  56  |     await page.fill('[name="email"]', "invalid@example.com");
  57  |     await page.fill('[name="password"]', "wrongpassword");
  58  |     await page.click('[type="submit"]');
  59  | 
  60  |     // NextAuth redirects to /auth/error?error=... on failed credentials login.
  61  |     // The application's custom error page renders "Fehler: <message>".
  62  |     await expect(page).toHaveURL(/\/auth\/(error|signin)/, { timeout: 3000 });
  63  | 
  64  |     // Either the error page URL contains "error" param or the signin page shows an error
  65  |     const currentUrl = page.url();
  66  |     const hasErrorInUrl =
  67  |       currentUrl.includes("/auth/error") || currentUrl.includes("error=");
  68  |     expect(hasErrorInUrl).toBeTruthy();
  69  | 
  70  |     // Verify the error is surfaced in the page content
  71  |     const errorText = page.locator("div").filter({ hasText: /Fehler:|error/i });
  72  |     const signInStillVisible = page.locator(
  73  |       '[role="alert"], [data-error], .error'
  74  |     );
  75  |     const anyErrorVisible =
  76  |       (await errorText.count()) > 0 ||
  77  |       (await signInStillVisible.count()) > 0 ||
  78  |       hasErrorInUrl;
  79  |     expect(anyErrorVisible).toBeTruthy();
  80  | 
  81  |     // No session cookie must be set
  82  |     const cookies = await page.context().cookies();
  83  |     const sessionCookie = cookies.find(
  84  |       (c) =>
  85  |         c.name.includes("session-token") || c.name.includes("next-auth")
  86  |     );
  87  |     expect(sessionCookie).toBeUndefined();
  88  |   });
  89  | 
  90  |   // Task 6.4 – Requirement 3.4
  91  |   test("Dashboard zeigt Nutzernamen nach Login", async ({ browser }) => {
  92  |     // Use a fresh browser context to avoid state leakage
  93  |     const context = await browser.newContext();
  94  |     const page = await context.newPage();
  95  | 
  96  |     try {
  97  |       // Log in via the NextAuth credentials form
  98  |       await page.goto(
  99  |         `/api/auth/signin/credentials?callbackUrl=${encodeURIComponent("http://localhost:3000/")}`
  100 |       );
  101 |       await page.fill('[name="email"]', VALID_EMAIL);
  102 |       await page.fill('[name="password"]', VALID_PASSWORD);
  103 |       await page.click('[type="submit"]');
  104 | 
  105 |       // Wait until we land somewhere on the dashboard
  106 |       await page.waitForURL(/\/dashboard/, { timeout: 5000 });
  107 | 
  108 |       // The PageLayout header displays "Schön dich zu sehen, {username}!" when
  109 |       // session.user.username is set. Walter White has username "heisenberg".
  110 |       // We look for either:
  111 |       //   a) the greeting text containing the username, or
  112 |       //   b) an avatar image with a non-empty alt attribute matching the user's name
  113 |       const greetingText = page.locator("text=/Schön dich zu sehen/");
  114 |       const avatarWithAlt = page.locator('img[alt]:not([alt=""])').first();
  115 | 
  116 |       const greetingVisible = await greetingText
  117 |         .isVisible()
```