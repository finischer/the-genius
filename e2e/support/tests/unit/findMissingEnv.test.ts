import fc from "fast-check";
import { E2E_REQUIRED_ENV, assertE2eEnv, findMissingEnv } from "../../env";

type TEnvState = "set" | "empty" | "unset";

const envStateArb = fc.constantFrom<TEnvState>("set", "empty", "unset");

const buildEnv = (
  names: readonly string[],
  states: readonly TEnvState[]
): Record<string, string | undefined> => {
  const env: Record<string, string | undefined> = {};
  names.forEach((name, index) => {
    const state = states[index];
    if (state === "set") env[name] = "value";
    else if (state === "empty") env[name] = "";
    else if (state === "unset") env[name] = undefined;
  });
  return env;
};

describe("Property 4: Fehlende Umgebungsvariablen werden vollständig gemeldet", () => {
  // **Validates: Requirements 3.3, 4.9, 12.4**
  it("findMissingEnv returns exactly the unset or empty names in input order", () => {
    fc.assert(
      fc.property(
        fc
          .uniqueArray(fc.stringMatching(/^[A-Z][A-Z0-9_]{0,15}$/), {
            maxLength: 20
          })
          .chain((names) =>
            fc.tuple(
              fc.constant(names),
              fc.array(envStateArb, {
                minLength: names.length,
                maxLength: names.length
              })
            )
          ),
        ([names, states]) => {
          const env = buildEnv(names, states);
          const expected = names.filter((_, i) => states[i] !== "set");

          expect(findMissingEnv(names, env)).toEqual(expected);
        }
      ),
      { numRuns: 100 }
    );
  });

  // **Validates: Requirements 3.3, 4.9, 12.4**
  it("assertE2eEnv throws iff required variables are missing and names every one of them", () => {
    const missingFilePath = "/nonexistent/.env.test";

    fc.assert(
      fc.property(
        fc.array(envStateArb, {
          minLength: E2E_REQUIRED_ENV.length,
          maxLength: E2E_REQUIRED_ENV.length
        }),
        (states) => {
          const env = buildEnv(E2E_REQUIRED_ENV, states);
          const missing = E2E_REQUIRED_ENV.filter((_, i) => states[i] !== "set");

          if (missing.length === 0) {
            expect(() => assertE2eEnv(env, missingFilePath)).not.toThrow();
            return;
          }

          let message = "";
          try {
            assertE2eEnv(env, missingFilePath);
          } catch (error) {
            message = error instanceof Error ? error.message : String(error);
          }
          expect(message).not.toBe("");
          for (const name of missing) {
            expect(message).toContain(name);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
