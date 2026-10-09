import fc from "fast-check";
import {
  ALLOWED_DB_SUFFIXES,
  assertSafeDatabaseUrl
} from "../../database";

const word = (minLength: number, maxLength: number) =>
  fc.stringMatching(new RegExp(`^[a-z0-9_]{${minLength},${maxLength}}$`));

const databaseName = fc
  .tuple(
    word(1, 20),
    fc.constantFrom<string>("", "_e2e", "_test", "e2e", "test", "_prod", "_dev")
  )
  .map(([base, suffix]) => `${base}${suffix}`);

const connectionUrl = (name: string) =>
  fc
    .record({
      protocol: fc.constantFrom("postgresql", "postgres"),
      user: word(1, 12),
      password: word(1, 12),
      host: fc.constantFrom("localhost", "127.0.0.1", "db.example.com"),
      port: fc.integer({ min: 1, max: 65535 }),
      query: fc.array(fc.tuple(word(1, 8), word(0, 8)), { maxLength: 3 })
    })
    .map(({ protocol, user, password, host, port, query }) => {
      const search = query.map(([k, v]) => `${k}=${v}`).join("&");
      return `${protocol}://${user}:${password}@${host}:${port}/${name}${
        search ? `?${search}` : ""
      }`;
    });

const databaseUrl = databaseName.chain((name) =>
  connectionUrl(name).map((url) => ({ name, url }))
);

const hasAllowedSuffix = (name: string) =>
  ALLOWED_DB_SUFFIXES.some((suffix) => name.endsWith(suffix));

const getError = (url: string | undefined): Error | undefined => {
  try {
    assertSafeDatabaseUrl(url);
    return undefined;
  } catch (error) {
    return error as Error;
  }
};

describe("assertSafeDatabaseUrl", () => {
  /**
   * Feature: e2e-testing-concept, Property 3: Datenbank-Guard akzeptiert genau Test-Datenbanken
   * **Validates: Requirements 3.1, 3.2**
   */
  it("accepts a URL if and only if the database name ends with an allowed suffix", () => {
    fc.assert(
      fc.property(databaseUrl, ({ name, url }) => {
        const error = getError(url);

        if (hasAllowedSuffix(name)) {
          expect(error).toBeUndefined();
        } else {
          expect(error).toBeInstanceOf(Error);
          expect(error?.message).toContain(name);
          for (const suffix of ALLOWED_DB_SUFFIXES) {
            expect(error?.message).toContain(suffix);
          }
        }
      }),
      { numRuns: 100 }
    );
  });

  it("rejects missing or unparsable URLs and names both suffixes", () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(undefined),
          fc.constant(""),
          fc.stringMatching(/^[a-z0-9 ]{1,20}$/)
        ),
        (url) => {
          const error = getError(url);
          expect(error).toBeInstanceOf(Error);
          for (const suffix of ALLOWED_DB_SUFFIXES) {
            expect(error?.message).toContain(suffix);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
