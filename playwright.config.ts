import {
  defineConfig,
  devices,
  type PlaywrightTestConfig
} from "@playwright/test";
import { config as loadDotenv } from "dotenv";
import {
  resolveBaseUrl,
  resolveProjectNames,
  type TProjectName
} from "./e2e/support/config";
import { assertSafeDatabaseUrl } from "./e2e/support/database";
import { assertE2eEnv } from "./e2e/support/env";

loadDotenv({ path: ".env.test", quiet: true });
assertE2eEnv(process.env);
assertSafeDatabaseUrl(process.env.DATABASE_URL);

const PARTYKIT_PORT = 1999;
const baseURL = resolveBaseUrl(process.env.E2E_BASE_URL);
const isCi = !!process.env.CI;

const allProjects: Record<
  TProjectName,
  NonNullable<PlaywrightTestConfig["projects"]>[number]
> = {
  setup: { name: "setup", testMatch: /.*\.setup\.ts/ },
  chromium: {
    name: "chromium",
    testIgnore: /.*\.setup\.ts/,
    use: {
      ...devices["Desktop Chrome"],
      launchOptions: { args: ["--mute-audio"] }
    },
    dependencies: ["setup"]
  },
  firefox: {
    name: "firefox",
    testIgnore: /.*\.setup\.ts/,
    use: {
      ...devices["Desktop Firefox"],
      launchOptions: {
        firefoxUserPrefs: { "media.volume_scale": "0.0" }
      }
    },
    dependencies: ["setup"]
  },
  webkit: {
    name: "webkit",
    testIgnore: /.*\.setup\.ts/,
    use: { ...devices["Desktop Safari"] },
    dependencies: ["setup"]
  }
};

export default defineConfig({
  testDir: ".",
  // Specs live next to the code they cover (`<feature>/tests/e2e/*.spec.ts`);
  // cross-cutting specs and the auth setup live in the root tests/e2e
  testMatch: "**/tests/e2e/**/*.{spec,setup}.ts",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: isCi,
  retries: isCi ? 2 : 0,
  // A test that only passes on a retry is still a failure in CI
  failOnFlakyTests: isCi,
  workers: 4,
  globalSetup: "./e2e/support/globalSetup.ts",
  reporter: isCi
    ? [
        ["./e2e/support/reporter.ts"],
        ["github"],
        ["html", { outputFolder: "playwright-report", open: "never" }],
        ["json", { outputFile: "test-results/report.json" }]
      ]
    : [
        ["./e2e/support/reporter.ts"],
        ["html", { outputFolder: "playwright-report", open: "never" }]
      ],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  projects: resolveProjectNames(process.env).map((name) => allProjects[name]),
  webServer: [
    {
      command: "bun run dev:e2e",
      url: baseURL,
      timeout: 120_000,
      reuseExistingServer: !isCi,
      env: {
        APP_ENV: "development",
        NEXT_PUBLIC_DEBUG_MODE: "false",
        NEXT_PUBLIC_PARTYKIT_HOST: `localhost:${PARTYKIT_PORT}`,
        DATABASE_URL: process.env.DATABASE_URL ?? ""
      }
    },
    {
      command: `bunx wrangler dev --port ${PARTYKIT_PORT}`,
      port: PARTYKIT_PORT,
      timeout: 120_000,
      reuseExistingServer: !isCi
    }
  ]
});
