import * as fc from "fast-check";
import {
  OPERATORS_BY_TYPE,
  ColumnType,
  FilterOperator
} from "~/components/shared/DataTable/dataTable.types";

const NON_CUSTOM_TYPES = [
  ColumnType.Text,
  ColumnType.Email,
  ColumnType.Date,
  ColumnType.Role
] as const;

// ── Unit tests ────────────────────────────────────────────────────────────────

describe("OPERATORS_BY_TYPE", () => {
  it("returns a non-empty array for every ColumnType except Custom", () => {
    for (const type of NON_CUSTOM_TYPES) {
      expect(OPERATORS_BY_TYPE[type].length).toBeGreaterThan(0);
    }
  });

  it("returns an empty array for ColumnType.Custom", () => {
    expect(OPERATORS_BY_TYPE[ColumnType.Custom]).toEqual([]);
  });
});

// ── Property tests ────────────────────────────────────────────────────────────

describe("OPERATORS_BY_TYPE — property tests", () => {
  it("Date and Text operator sets are disjoint", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...OPERATORS_BY_TYPE[ColumnType.Date]),
        (dateOp) => {
          return !OPERATORS_BY_TYPE[ColumnType.Text].includes(dateOp);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("Date and Email operator sets are disjoint", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...OPERATORS_BY_TYPE[ColumnType.Date]),
        (dateOp) => {
          return !OPERATORS_BY_TYPE[ColumnType.Email].includes(dateOp);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("union of all non-Custom operator sets covers all FilterOperator values", () => {
    const allOperators = new Set(Object.values(FilterOperator));

    fc.assert(
      fc.property(fc.constantFrom(...allOperators), (op) => {
        const coveredByAtLeastOne = NON_CUSTOM_TYPES.some((type) =>
          OPERATORS_BY_TYPE[type].includes(op)
        );
        return coveredByAtLeastOne;
      }),
      { numRuns: 100 }
    );
  });
});
