import type { FullConfig } from "@playwright/test";
import { resolveBaseUrl } from "./config";
import { isDockerManaged, startE2eServices } from "./docker";

export const WARMUP_ROUTES = [
  "/api/auth/csrf",
  "/api/auth/session",
  "/auth/signin",
  "/impressum",
  "/datenschutz",
  "/",
  "/rooms",
  "/gameshows",
  "/gameshows/create",
  "/settings"
] as const;

const WARMUP_TIMEOUT_MS = 60_000;

/**
 * `next dev` compiles pages on first request. Requesting every smoke route
 * once keeps compilation time out of the individual test timeouts.
 */
export default async function globalSetup(
  config: FullConfig
): Promise<(() => void) | undefined> {
  const stopServices = isDockerManaged(process.env)
    ? startE2eServices()
    : undefined;

  const baseURL = resolveBaseUrl(
    config.projects[0]?.use.baseURL ?? process.env.E2E_BASE_URL
  );

  for (const route of WARMUP_ROUTES) {
    try {
      await fetch(new URL(route, baseURL), {
        signal: AbortSignal.timeout(WARMUP_TIMEOUT_MS)
      });
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      console.warn(`E2E warm-up failed for ${route}: ${reason}`);
    }
  }

  return stopServices;
}
