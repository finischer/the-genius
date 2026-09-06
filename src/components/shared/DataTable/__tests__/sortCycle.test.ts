import * as fc from "fast-check";
import type { TSortState } from "~/components/shared/DataTable/dataTable.types";

// ── Pure transition function (mirrors DataTable's handleSort logic) ────────────

function nextSortState<T>(
  current: TSortState<T> | null,
  clickedKey: keyof T
): TSortState<T> | null {
  if (current?.key === clickedKey) {
    if (current.direction === "asc")
      return { key: clickedKey, direction: "desc" };
    return null; // desc → null
  }
  return { key: clickedKey, direction: "asc" };
}

// ── Unit Tests ────────────────────────────────────────────────────────────────

describe("nextSortState — Unit Tests", () => {
  it("null → asc: clicking a key when sortState is null returns { key, direction: 'asc' }", () => {
    const result = nextSortState<{ name: string }>(null, "name");
    expect(result).toEqual({ key: "name", direction: "asc" });
  });

  it("asc → desc: clicking the same key when direction is 'asc' returns { key, direction: 'desc' }", () => {
    const current: TSortState<{ name: string }> = {
      key: "name",
      direction: "asc"
    };
    const result = nextSortState(current, "name");
    expect(result).toEqual({ key: "name", direction: "desc" });
  });

  it("desc → null: clicking the same key when direction is 'desc' returns null", () => {
    const current: TSortState<{ name: string }> = {
      key: "name",
      direction: "desc"
    };
    const result = nextSortState(current, "name");
    expect(result).toBeNull();
  });

  it("different key: clicking a different key when sort is active returns { newKey, direction: 'asc' }", () => {
    const current: TSortState<{ name: string; email: string }> = {
      key: "name",
      direction: "desc"
    };
    const result = nextSortState(current, "email");
    expect(result).toEqual({ key: "email", direction: "asc" });
  });
});

// ── Property Tests ────────────────────────────────────────────────────────────

// Arbitrary for a valid column key (non-empty string used as keyof T placeholder)
const arbitraryKey = fc
  .string({ minLength: 1, maxLength: 32 })
  .filter((s) => s.trim().length > 0);

describe("nextSortState — Sortierzustand-Zyklen", () => {
  it("dreimaliges Klicken auf denselben Key führt zu null (null → asc → desc → null)", () => {
    fc.assert(
      fc.property(arbitraryKey, (key) => {
        type Row = Record<string, unknown>;

        const afterFirst = nextSortState<Row>(null, key);
        expect(afterFirst).toEqual({ key, direction: "asc" });

        const afterSecond = nextSortState<Row>(afterFirst, key);
        expect(afterSecond).toEqual({ key, direction: "desc" });

        const afterThird = nextSortState<Row>(afterSecond, key);
        expect(afterThird).toBeNull();
      }),
      { numRuns: 100 }
    );
  });

  it("jeder Klick erzeugt ausschließlich einen der drei Zustände: null, asc oder desc", () => {
    fc.assert(
      fc.property(
        arbitraryKey,
        fc.oneof(
          fc.constant(null),
          arbitraryKey.map((key) => ({ key, direction: "asc" as const })),
          arbitraryKey.map((key) => ({ key, direction: "desc" as const }))
        ),
        (clickedKey, startingState) => {
          type Row = Record<string, unknown>;

          const result = nextSortState<Row>(startingState, clickedKey);

          if (result === null) return; // null is always valid

          expect(["asc", "desc"]).toContain(result.direction);
          expect(result.key).toBe(clickedKey);
        }
      ),
      { numRuns: 100 }
    );
  });
});
