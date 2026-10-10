import type { Page } from "@playwright/test";

export interface IBrowserError {
  type: "console" | "pageerror";
  text: string;
  url: string;
}

export interface IBrowserErrorTracker {
  readonly errors: readonly IBrowserError[];
  format: () => string;
}

export function formatBrowserErrors(
  url: string,
  errors: readonly IBrowserError[]
): string {
  const first = errors[0];
  if (!first) return `Keine Browser-Fehler auf ${url}`;
  const more = errors.length > 1 ? ` (+${errors.length - 1} weitere)` : "";
  return `Browser-Fehler auf ${url}: ${first.text}${more}`;
}

export function trackBrowserErrors(page: Page): IBrowserErrorTracker {
  const errors: IBrowserError[] = [];

  page.on("console", (message) => {
    if (message.type() !== "error") return;
    // Requests to external services are blocked on purpose by the fixtures
    if (message.text() === "Failed to load resource: net::ERR_FAILED") return;
    if (message.text().includes("Cross-Origin Request Blocked")) return;
    errors.push({
      type: "console",
      text: message.text(),
      url: page.url()
    });
  });
  page.on("pageerror", (error) => {
    errors.push({ type: "pageerror", text: error.message, url: page.url() });
  });

  return {
    errors,
    format: () => formatBrowserErrors(errors[0]?.url ?? page.url(), errors)
  };
}
