import fc from "fast-check";

import { createE2eName } from "../../names";

describe("createE2eName", () => {
  // Feature: e2e-testing-concept, Property 6: Generierte Gameshow-Namen haben gültiges Format und sind eindeutig
  // **Validates: Requirements 3.10**
  it("generates valid and pairwise distinct names", () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 200 }), (n) => {
        const names = Array.from({ length: n }, () => createE2eName());

        for (const name of names) {
          expect(name).toMatch(/^e2e-[A-Za-z0-9]{8,}$/);
        }
        expect(new Set(names).size).toBe(n);
      }),
      { numRuns: 100 }
    );
  });
});
