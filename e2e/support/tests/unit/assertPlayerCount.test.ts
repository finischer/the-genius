import fc from "fast-check";

import { assertPlayerCount } from "../../players";

const numberArb = fc.oneof(
  fc.integer({ min: -10, max: 15 }),
  fc.double({ min: -10, max: 15, noNaN: true }),
  fc.constantFrom(NaN, Infinity, -Infinity)
);

describe("assertPlayerCount", () => {
  // Feature: e2e-testing-concept, Property 8: Spieleranzahl wird genau im Bereich 1 bis 5 akzeptiert
  // **Validates: Requirements 9.7, 9.8**
  it("accepts exactly integers from 1 to 5 and names the range in the error", () => {
    fc.assert(
      fc.property(numberArb, (n) => {
        const valid = Number.isInteger(n) && n >= 1 && n <= 5;
        if (valid) {
          expect(() => assertPlayerCount(n)).not.toThrow();
        } else {
          expect(() => assertPlayerCount(n)).toThrow(/1.*5/);
        }
      }),
      { numRuns: 100 }
    );
  });
});
