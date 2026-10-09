import fc from "fast-check";

import {
  type ICleanupGameshow,
  selectCleanupTargets
} from "../../cleanup";

const userIdArb = fc.constantFrom("user-a", "user-b", "user-c");

const gameshowsArb = fc.array(
  fc.record({
    id: fc.uuid(),
    creatorId: fc.option(userIdArb, { nil: null })
  }),
  { maxLength: 30 }
);

describe("selectCleanupTargets", () => {
  // Feature: e2e-testing-concept, Property 5: Cleanup trifft nur Gameshows des Nutzers
  // **Validates: Requirements 3.8**
  it("returns exactly the ids of gameshows created by the user and leaves input unchanged", () => {
    fc.assert(
      fc.property(userIdArb, gameshowsArb, (userId, gameshows) => {
        const snapshot: ICleanupGameshow[] = gameshows.map((g) => ({ ...g }));

        const result = selectCleanupTargets(userId, gameshows);

        const expected = gameshows
          .filter((g) => g.creatorId === userId)
          .map((g) => g.id);
        expect(result).toEqual(expected);

        const foreignIds = new Set(
          gameshows.filter((g) => g.creatorId !== userId).map((g) => g.id)
        );
        expect(result.some((id) => foreignIds.has(id))).toBe(false);

        expect(gameshows).toEqual(snapshot);
      }),
      { numRuns: 100 }
    );
  });
});
