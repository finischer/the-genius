import fc from "fast-check";
import { resolveProjectNames } from "../../config";

const flagValue = fc.option(fc.string(), { nil: undefined });

describe("resolveProjectNames", () => {
  /**
   * Feature: e2e-testing-concept, Property 1: Projektauswahl hängt nur von
   * zwei Flags ab
   * **Validates: Requirements 2.3, 2.4**
   */
  it("depends only on whether CI and E2E_ALL_BROWSERS are non-empty", () => {
    fc.assert(
      fc.property(
        flagValue,
        flagValue,
        fc.dictionary(fc.string(), fc.string()),
        (ci, allBrowsers, rest) => {
          const env = { ...rest, CI: ci, E2E_ALL_BROWSERS: allBrowsers };
          const result = resolveProjectNames(env);

          const chromiumOnly = (ci ?? "") !== "" && (allBrowsers ?? "") === "";
          expect(result).toEqual(
            chromiumOnly
              ? ["setup", "chromium"]
              : ["setup", "chromium", "firefox", "webkit"]
          );
          expect(result[0]).toBe("setup");
        }
      ),
      { numRuns: 100 }
    );
  });
});
