export type TProjectName = "setup" | "chromium" | "firefox" | "webkit";

const DEFAULT_BASE_URL = "http://localhost:3000";

export function resolveBaseUrl(raw: string | undefined): string {
  return raw === undefined || raw === "" ? DEFAULT_BASE_URL : raw;
}

/**
 * Only the emptiness of `CI` and `E2E_ALL_BROWSERS` matters, not their value
 * (so `E2E_ALL_BROWSERS=false` still enables all browsers).
 */
export function resolveProjectNames(
  env: Record<string, string | undefined>
): TProjectName[] {
  const isCi = (env.CI ?? "") !== "";
  const allBrowsers = (env.E2E_ALL_BROWSERS ?? "") !== "";

  if (isCi && !allBrowsers) {
    return ["setup", "chromium"];
  }
  return ["setup", "chromium", "firefox", "webkit"];
}
