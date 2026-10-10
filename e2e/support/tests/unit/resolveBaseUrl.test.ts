import fc from "fast-check";
import { resolveBaseUrl } from "../../config";

describe("resolveBaseUrl", () => {
  // Feature: e2e-testing-concept, Property 2: baseURL-Auflösung mit Fallback
  // **Validates: Requirements 2.7, 2.8**
  it("uses the value when non-empty and the default otherwise", () => {
    fc.assert(
      fc.property(fc.option(fc.string(), { nil: undefined }), (raw) => {
        const expected = raw ? raw : "http://localhost:3000";
        expect(resolveBaseUrl(raw)).toBe(expected);
      }),
      { numRuns: 100 }
    );
  });
});
