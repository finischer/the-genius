import fc from "fast-check";

import { buildGameCases } from "../../gameCases";

const identifiersArb = fc.uniqueArray(
  fc.stringMatching(/^[a-z][a-z0-9-]{0,19}$/),
  { maxLength: 20 }
);

describe("buildGameCases", () => {
  // Feature: e2e-testing-concept, Property 7: Spiel-Testfälle werden vollständig aus der Registry abgeleitet
  // **Validates: Requirements 7.1, 7.2**
  it("derives exactly three cases (picker, configurator, room) per identifier with the identifier in the title", () => {
    fc.assert(
      fc.property(identifiersArb, (identifiers) => {
        const cases = buildGameCases(identifiers);

        expect(cases).toHaveLength(identifiers.length * 3);

        for (const identifier of identifiers) {
          const own = cases.filter((c) => c.identifier === identifier);
          expect(own.map((c) => c.check).sort()).toEqual([
            "configurator",
            "picker",
            "room"
          ]);
          for (const c of own) {
            expect(c.title).toContain(identifier);
          }
        }
      }),
      { numRuns: 100 }
    );
  });
});
