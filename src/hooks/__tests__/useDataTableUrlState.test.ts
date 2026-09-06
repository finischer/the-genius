import * as fc from "fast-check";
import {
  serializeFilter,
  serializeSort,
  parseFilter,
  parseSort,
  parseCursor
} from "~/hooks/useDataTableUrlState";
import { FilterOperator } from "~/components/shared/DataTable/dataTable.types";
import type {
  TFilterState,
  TSortState
} from "~/components/shared/DataTable/dataTable.types";

// ── Arbitraries ───────────────────────────────────────────────────────────────

// Keys must be non-empty alphanumeric strings so they survive the
// filter[key]=operator:value URL round-trip without ambiguity.
const arbitraryKey = fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9]{0,19}$/);

// Operator values come directly from the FilterOperator enum.
const allOperators = Object.values(FilterOperator);
const arbitraryOperator = fc.constantFrom(...allOperators);

// Values must be non-empty and must not contain ":" because the serialization
// format is "operator:value" — a colon in the value would break parsing.
const arbitraryFilterValue = fc
  .string({ minLength: 1, maxLength: 50 })
  .filter((s) => !s.includes(":"));

// A single filter entry.
const arbitraryFilterEntry = fc.record({
  operator: arbitraryOperator,
  value: arbitraryFilterValue
});

// A TFilterState<Record<string,unknown>>: a map of 0–5 key → entry pairs.
// We use Record<string,unknown> as T because the generic only constrains the
// key to keyof T; string keys are compatible with every T in practice here.
const arbitraryFilterState: fc.Arbitrary<
  TFilterState<Record<string, unknown>>
> = fc
  .uniqueArray(arbitraryKey, { minLength: 0, maxLength: 5 })
  .chain((keys) => {
    if (keys.length === 0) return fc.constant({});
    return fc
      .tuple(
        ...(keys.map(() => arbitraryFilterEntry) as [
          fc.Arbitrary<{ operator: FilterOperator; value: string }>
        ])
      )
      .map((entries) => {
        const state: TFilterState<Record<string, unknown>> = {};
        keys.forEach((k, i) => {
          state[k] = entries[i];
        });
        return state;
      });
  });

const arbitrarySortDirection = fc.constantFrom("asc" as const, "desc" as const);

// A TSortState: a non-empty key + a direction.
const arbitrarySortState: fc.Arbitrary<TSortState<Record<string, unknown>>> =
  fc.record({
    key: arbitraryKey,
    direction: arbitrarySortDirection
  });

// ── Property 3a: Filter Round-Trip ───────────────────────────────────────────

describe("Property 3a: Filter Round-Trip", () => {
  it("parseFilter(serializeFilter(f)) ≡ f for arbitrary FilterStates", () => {
    fc.assert(
      fc.property(arbitraryFilterState, (f) => {
        const serialized = serializeFilter(f);
        // serializeFilter returns Record<string, string> with keys like
        // "filter[fieldName]" — pass it directly as the query object.
        const parsed = parseFilter<Record<string, unknown>>(serialized);
        expect(parsed).toEqual(f);
      }),
      { numRuns: 100 }
    );
  });
});

// ── Property 3b: Sort Round-Trip ─────────────────────────────────────────────

describe("Property 3b: Sort Round-Trip", () => {
  it("parseSort(serializeSort(s)) ≡ s for arbitrary SortStates", () => {
    fc.assert(
      fc.property(arbitrarySortState, (s) => {
        const serialized = serializeSort(s);
        const parsed = parseSort<Record<string, unknown>>(serialized);
        expect(parsed).toEqual(s);
      }),
      { numRuns: 100 }
    );
  });

  it("parseSort(serializeSort(null)) === null", () => {
    const serialized = serializeSort<Record<string, unknown>>(null);
    const parsed = parseSort<Record<string, unknown>>(serialized);
    expect(parsed).toBeNull();
  });
});

// ── Unit tests: parseCursor ───────────────────────────────────────────────────

describe("parseCursor", () => {
  it("returns null when cursor param is absent", () => {
    expect(parseCursor({})).toBeNull();
  });

  it("returns the cursor string when param is present", () => {
    expect(parseCursor({ cursor: "abc123" })).toBe("abc123");
  });

  it("handles array-shaped cursor (takes first value)", () => {
    expect(parseCursor({ cursor: ["first", "second"] })).toBe("first");
  });
});

// ── Unit tests: unknown / invalid params are silently ignored ─────────────────

describe("parseFilter — invalid inputs", () => {
  it("ignores entries with an unknown operator", () => {
    const query = { "filter[username]": "UNKNOWN_OP:somevalue" };
    const result = parseFilter<{ username: string }>(query);
    expect(result).toEqual({});
  });

  it("ignores malformed filter params missing a colon separator", () => {
    const query = { "filter[email]": "equalsNoCOLON" };
    const result = parseFilter<{ email: string }>(query);
    expect(result).toEqual({});
  });

  it("ignores filter params that are not bracketed correctly", () => {
    const query = { filterusername: "equals:foo" };
    const result = parseFilter<{ username: string }>(query);
    expect(result).toEqual({});
  });
});

describe("parseSort — invalid inputs", () => {
  it("returns null for an invalid direction", () => {
    expect(
      parseSort<{ username: string }>({ sort: "username:random" })
    ).toBeNull();
  });

  it("returns null when sort param is absent", () => {
    expect(parseSort<{ username: string }>({})).toBeNull();
  });

  it("returns null when sort param has no colon separator", () => {
    expect(parseSort<{ username: string }>({ sort: "usernameAsc" })).toBeNull();
  });
});
