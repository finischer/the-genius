import fs from "node:fs/promises";
import path from "node:path";
import { expect, test as setup, request } from "@playwright/test";
import { getE2eAccounts, type IE2eAccount } from "../../../e2e/fixtures/auth";
import { findMissingEnv } from "../../../e2e/support/env";
import { resolveBaseUrl } from "../../../e2e/support/config";

interface ICsrfResponse {
  csrfToken?: string;
}

interface ISessionResponse {
  user?: { role?: string } | null;
}

async function loginAccount(
  account: IE2eAccount,
  baseURL: string
): Promise<void> {
  await fs.rm(account.stateFile, { force: true });

  const context = await request.newContext({ baseURL });
  try {
    // next dev may answer with an HTML error page while it compiles a route,
    // so the whole login sequence is retried
    await expect(async () => {
      const csrfResponse = await context.get("/api/auth/csrf");
      const bodyText = await csrfResponse.text();
      let csrfToken: string | undefined;
      try {
        csrfToken = (JSON.parse(bodyText) as ICsrfResponse).csrfToken;
      } catch {
        // Non-JSON answer, e.g. the HTML error page of the dev server
      }
      if (!csrfResponse.ok() || !csrfToken) {
        const excerpt = bodyText
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .slice(0, 300);
        throw new Error(
          `CSRF-Token nicht abrufbar (HTTP ${csrfResponse.status()}): ${excerpt}`
        );
      }
      await context.post("/api/auth/callback/credentials", {
        form: {
          csrfToken,
          email: account.email,
          password: account.password,
          json: "true"
        }
      });
      const sessionResponse = await context.get("/api/auth/session");
      const session = (await sessionResponse.json()) as ISessionResponse | null;
      const role = session?.user?.role;
      if (role !== account.expectedRole) {
        throw new Error(
          `Rolle ist "${role ?? "keine Session"}", erwartet "${account.expectedRole}"`
        );
      }
    }).toPass({ timeout: 30_000 });
    await fs.mkdir(path.dirname(account.stateFile), { recursive: true });
    await context.storageState({ path: account.stateFile });
  } catch (error) {
    await fs.rm(account.stateFile, { force: true });
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Login fehlgeschlagen für Konto "${account.label}": ${reason}`
    );
  } finally {
    await context.dispose();
  }
}

setup.describe("Auth_Setup", () => {
  const baseURL = resolveBaseUrl(process.env.E2E_BASE_URL);

  for (const account of getE2eAccounts()) {
    setup(`login ${account.label}`, async () => {
      setup.setTimeout(30_000);

      const missing = findMissingEnv(
        ["E2E_TEST_EMAIL", "E2E_TEST_PASSWORD", "E2E_ADMIN_EMAIL"],
        process.env
      );
      if (missing.length > 0) {
        throw new Error(
          `Login nicht möglich für Konto "${account.label}": fehlende Variablen ${missing.join(", ")}`
        );
      }

      await loginAccount(account, baseURL);
    });
  }
});
