import fc from "fast-check";
import {
  applyBuzzerPress,
  createInitialRoomBuzzerState
} from "~/utils/buzzerLogic";

// Feature: playwright-e2e-tests, Property 1: Buzzer-Exklusivität
// Validates: Requirements 6.1, 6.3, 6.5
describe("buzzerLogic", () => {
  describe("Property 1: Buzzer-Exklusivität", () => {
    it("exactly one team is active after any buzzer press on an unlocked, uncontested buzzer", () => {
      fc.assert(
        fc.property(
          fc.constantFrom("teamOne" as const, "teamTwo" as const),
          (pressingTeam) => {
            const state = createInitialRoomBuzzerState();
            const newState = applyBuzzerPress(state, pressingTeam);
            const activeTeams = Object.values(newState.teams).filter(
              (t) => t.isActiveTurn
            );
            return activeTeams.length === 1;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("no team becomes active when buzzer is already pressed", () => {
      fc.assert(
        fc.property(
          fc.constantFrom("teamOne" as const, "teamTwo" as const),
          fc.constantFrom("teamOne" as const, "teamTwo" as const),
          (firstTeam, secondTeam) => {
            const state = createInitialRoomBuzzerState();
            // First press activates one team
            const afterFirstPress = applyBuzzerPress(state, firstTeam);
            // Second press from any team should be ignored — turn is already taken
            const afterSecondPress = applyBuzzerPress(
              afterFirstPress,
              secondTeam
            );
            const activeTeams = Object.values(afterSecondPress.teams).filter(
              (t) => t.isActiveTurn
            );
            // At most one team can ever be active — second press must not add a second
            return activeTeams.length <= 1;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
