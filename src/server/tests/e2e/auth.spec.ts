import { test, expect } from "@e2e/fixtures";
import { AdminPage } from "@e2e/pages/AdminPage";
import { SignInPage } from "@e2e/pages/SignInPage";
import { UserMenu } from "@e2e/pages/UserMenu";

const SESSION_COOKIE_PATTERN = /session-token/;

test.describe("Authentifizierung", () => {
  test("leitet anonyme Besucher ohne callbackUrl auf /auth/signin weiter", async ({
    page,
    signInPage
  }) => {
    await page.goto("/rooms");

    await expect(page).toHaveURL(/\/auth\/signin$/);
    await expect(signInPage.heading).toBeVisible();
  });

  test("zeigt Google- und Discord-Button auf der Anmeldeseite", async ({
    signInPage
  }) => {
    await signInPage.goto();

    await expect(signInPage.googleButton).toBeVisible();
    await expect(signInPage.discordButton).toBeVisible();
  });

  test("falsche Zugangsdaten erzeugen Fehler und keine Session", async ({
    page
  }) => {
    const csrfResponse = await page.request.get("/api/auth/csrf");
    const { csrfToken } = (await csrfResponse.json()) as { csrfToken: string };

    const loginResponse = await page.request.post(
      "/api/auth/callback/credentials",
      {
        form: {
          csrfToken,
          email: "e2e-unknown@thegenius.e2e",
          password: "wrong-password",
          json: "true"
        }
      }
    );
    const { url } = (await loginResponse.json()) as { url: string };
    expect(url).toContain("error=");

    const sessionResponse = await page.request.get("/api/auth/session");
    // next-auth answers with an empty object when there is no session
    expect(await sessionResponse.json()).toEqual({});

    const cookies = await page.context().cookies();
    expect(
      cookies.filter((cookie) => SESSION_COOKIE_PATTERN.test(cookie.name))
    ).toHaveLength(0);

    const errorCode = new URL(url).searchParams.get("error") ?? "";
    await page.goto(`/auth/error?error=${encodeURIComponent(errorCode)}`);
    await expect(page.getByText(`Fehler: ${errorCode}`)).toBeVisible();
  });

  test("Logout beendet die Session", async ({ userSession }) => {
    const userMenu = new UserMenu(userSession);

    await userSession.goto("/");
    await userMenu.logout();

    await expect(userSession).toHaveURL(/\/auth\/signin$/);
    await expect(new SignInPage(userSession).heading).toBeVisible();

    const cookies = await userSession.context().cookies();
    expect(
      cookies.filter((cookie) => SESSION_COOKIE_PATTERN.test(cookie.name))
    ).toHaveLength(0);
  });

  test("Nicht-Admin wird von Admin-Seiten abgewiesen", async ({
    userSession
  }) => {
    const adminPage = new AdminPage(userSession);

    await adminPage.goto("users");

    await expect(adminPage.deniedAlert.first()).toBeVisible();
    await expect(userSession).toHaveURL(/\/$/);
    await expect(adminPage.table).toHaveCount(0);
  });
});
