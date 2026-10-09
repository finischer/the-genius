import { test as base, type BrowserContext, type Page } from "@playwright/test";
import path from "path";
import { muteAudio } from "../helpers/audio";
import { skipGameIntro } from "../helpers/gameIntro";
import fs from "fs";

export type TE2eRole = "USER" | "ADMIN" | "PREMIUM";

export interface IE2eAccount {
  label: string;
  email: string;
  password: string;
  expectedRole: TE2eRole;
  stateFile: string;
}

export const E2E_AUTH_DIR = "e2e/.auth";
export const E2E_WORKER_COUNT = 4;
export const E2E_WORKER_EMAIL_DOMAIN = "thegenius.e2e";

export function getStateFile(label: string): string {
  return path.join(E2E_AUTH_DIR, `${label}.json`);
}

export function getE2eAccounts(
  env: Record<string, string | undefined> = process.env
): IE2eAccount[] {
  const testPassword = env.E2E_TEST_PASSWORD ?? "";
  const workers = Array.from(
    { length: E2E_WORKER_COUNT },
    (_, index): IE2eAccount => ({
      label: `worker-${index}`,
      email: `e2e-worker-${index}@${E2E_WORKER_EMAIL_DOMAIN}`,
      password: testPassword,
      expectedRole: "PREMIUM",
      stateFile: getStateFile(`worker-${index}`)
    })
  );

  return [
    {
      label: "user",
      email: env.E2E_TEST_EMAIL ?? "",
      password: testPassword,
      expectedRole: "USER",
      stateFile: getStateFile("user")
    },
    {
      label: "admin",
      email: env.E2E_ADMIN_EMAIL ?? "",
      password: env.E2E_ADMIN_PASSWORD ?? "",
      expectedRole: "ADMIN",
      stateFile: getStateFile("admin")
    },
    ...workers
  ];
}

export const BLOCKED_EXTERNAL_ROUTES = [
  "**/*posthog*/**",
  "https://accounts.google.com/**",
  "https://discord.com/**",
  "https://*.googleapis.com/**"
] as const;

const TOUR_STORAGE_KEYS = [
  "moderator-tour",
  "player-tour",
  "import-gameshow-tour"
] as const;

/**
 * Blocks third-party requests, mutes audio, skips the game intro and disables the onboarding
 * tours, whose overlay would otherwise intercept pointer events.
 */
export async function blockExternalServices(
  context: BrowserContext
): Promise<void> {
  await muteAudio(context);
  await skipGameIntro(context);
  await context.addInitScript((keys) => {
    for (const key of keys) window.localStorage.setItem(key, "false");
  }, TOUR_STORAGE_KEYS);
  for (const pattern of BLOCKED_EXTERNAL_ROUTES) {
    await context.route(pattern, (route) => route.abort());
  }
}

export interface IWorkerUser {
  index: number;
  email: string;
  storageState: string;
}

export function getWorkerUser(index: number): IWorkerUser {
  const account = getE2eAccounts().find(
    (candidate) => candidate.label === `worker-${index}`
  );
  if (!account) {
    throw new Error(`Kein E2E-Worker-Konto für Index ${index} vorhanden`);
  }
  return {
    index,
    email: account.email,
    storageState: account.stateFile
  };
}

function getAccountStateFile(label: string): string {
  const account = getE2eAccounts().find((a) => a.label === label);
  if (!account) throw new Error(`Unbekanntes E2E-Konto: ${label}`);
  if (!fs.existsSync(account.stateFile)) {
    throw new Error(
      `Storage_State für Konto "${label}" fehlt (${account.stateFile}). Läuft das setup-Projekt?`
    );
  }
  return account.stateFile;
}

type AuthFixtures = {
  userSession: Page;
  adminSession: Page;
  workerSession: Page;
};

type AuthWorkerFixtures = {
  workerUser: IWorkerUser;
};

export const test = base.extend<AuthFixtures, AuthWorkerFixtures>({
  context: async ({ context }, use) => {
    await blockExternalServices(context);
    await use(context);
  },

  workerUser: [
    // parallelIndex stays within 0..workers-1 even after worker restarts

    async ({}, use, workerInfo) => {
      await use(getWorkerUser(workerInfo.parallelIndex));
    },
    { scope: "worker" }
  ],

  userSession: async ({ browser, baseURL }, use) => {
    const context = await browser.newContext({
      baseURL,
      storageState: getAccountStateFile("user")
    });
    await blockExternalServices(context);
    await use(await context.newPage());
    await context.close();
  },

  adminSession: async ({ browser, baseURL }, use) => {
    const context = await browser.newContext({
      baseURL,
      storageState: getAccountStateFile("admin")
    });
    await blockExternalServices(context);
    await use(await context.newPage());
    await context.close();
  },

  workerSession: async ({ browser, baseURL, workerUser }, use) => {
    if (!fs.existsSync(workerUser.storageState)) {
      throw new Error(
        `Storage_State für Konto "worker-${workerUser.index}" fehlt (${workerUser.storageState}). Läuft das setup-Projekt?`
      );
    }
    const context = await browser.newContext({
      baseURL,
      storageState: workerUser.storageState
    });
    await blockExternalServices(context);
    await use(await context.newPage());
    await context.close();
  }
});

export { expect } from "@playwright/test";
