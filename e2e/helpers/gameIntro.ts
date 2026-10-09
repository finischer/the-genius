import type { BrowserContext } from "@playwright/test";

const SKIP_GAME_INTRO_KEY = "skip-game-intro";

async function setSkipGameIntro(
  context: BrowserContext,
  skip: boolean
): Promise<void> {
  await context.addInitScript(
    ([key, value]) => window.localStorage.setItem(key, value),
    [SKIP_GAME_INTRO_KEY, String(skip)] as const
  );
}

/** Default for all E2E contexts: the ~10s game intro is skipped. */
export const skipGameIntro = (context: BrowserContext) =>
  setSkipGameIntro(context, true);

/** Call after the fixtures created the context, in tests that cover the intro. */
export const enableGameIntro = (context: BrowserContext) =>
  setSkipGameIntro(context, false);
