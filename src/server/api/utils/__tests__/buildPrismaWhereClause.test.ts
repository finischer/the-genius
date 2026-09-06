import { expect } from "vitest";
import { it } from "vitest";
import { describe } from "vitest";
import * as fc from "fast-check";
import { FilterOperator } from "~/components/shared/DataTable/dataTable.types";
import { buildPrismaWhereClause } from "~/server/api/utils/dataTableInput";

// ── Arbitraries ───────────────────────────────────────────────────────────────

// Non-empty string that avoids edge cases like NaN-producing date strings.
const nonEmptyString = fc
  .string({ minLength: 1, maxLength: 64 })
  .filter((s) => s.trim().length > 0);

// A valid ISO date string (always parseable).
const isoDateString = fc
  .date({ min: new Date("2000-01-01"), max: new Date("2099-12-31") })
  .map((d) => d.toISOString());

// Text/email operators that accept arbitrary string values.
const textOperator = fc.constantFrom(
  FilterOperator.Equals,
  FilterOperator.NotEquals,
  FilterOperator.Contains,
  FilterOperator.StartsWith,
  FilterOperator.EndsWith
);

// Date operators that require ISO date strings.
const dateOperator = fc.constantFrom(
  FilterOperator.Before,
  FilterOperator.After,
  FilterOperator.OnDate
);

// A single FilterEntry for a text-type operator.
const textFilterEntry = fc.record({
  operator: textOperator,
  value: nonEmptyString
});

// A single FilterEntry for a date-type operator.
const dateFilterEntry = fc.record({
  operator: dateOperator,
  value: isoDateString
});

// Combines both entry types into one arbitrary.
const anyFilterEntry = fc.oneof(textFilterEntry, dateFilterEntry);

// A FilterState with 1–5 unique field keys.
const filterState = fc
  .uniqueArray(nonEmptyString, { minLength: 1, maxLength: 5 })
  .chain((keys) =>
    fc
      .array(anyFilterEntry, { minLength: keys.length, maxLength: keys.length })
      .map((entries) => {
        const state: Record<
          string,
          { operator: FilterOperator; value: string }
        > = {};
        keys.forEach((key, i) => {
          state[key] = entries[i]!;
        });
        return state;
      })
  );

// ── Property 1: Filter-Übersetzung ist abgeschlossen ─────────────────────────

describe("buildPrismaWhereClause — Filter-Übersetzung ist abgeschlossen", () => {
  it("gibt für N Schlüssel im FilterState genau N Einträge zurück", () => {
    fc.assert(
      fc.property(filterState, (filter) => {
        const result = buildPrismaWhereClause(filter);
        const inputKeys = Object.keys(filter);
        const outputKeys = Object.keys(result);

        // Every input key must appear in the output.
        expect(outputKeys).toHaveLength(inputKeys.length);
        for (const key of inputKeys) {
          expect(result).toHaveProperty(key);
          // The value must be a non-null object (a Prisma condition).
          expect(result[key]).toBeDefined();
          expect(typeof result[key]).toBe("object");
        }
      }),
      { numRuns: 100 }
    );
  });

  it("gibt ein leeres Objekt für undefined zurück", () => {
    expect(buildPrismaWhereClause(undefined)).toEqual({});
  });

  it("gibt ein leeres Objekt für einen leeren FilterState zurück", () => {
    expect(buildPrismaWhereClause({})).toEqual({});
  });
});

// ── Property 2: Operator-Mapping erzeugt korrekte Prisma-Struktur ─────────────

describe("buildPrismaWhereClause — Operator-Mapping erzeugt korrekte Prisma-Struktur", () => {
  // ── Text/String operators ─────────────────────────────────────────────────

  it("equals → { equals, mode: 'insensitive' }, kein anderer Schlüssel", () => {
    fc.assert(
      fc.property(nonEmptyString, (value) => {
        const result = buildPrismaWhereClause({
          field: { operator: FilterOperator.Equals, value }
        });
        const condition = result["field"] as Record<string, unknown>;
        expect(condition).toHaveProperty("equals", value);
        expect(condition).toHaveProperty("mode", "insensitive");
        expect(condition).not.toHaveProperty("contains");
        expect(condition).not.toHaveProperty("startsWith");
        expect(condition).not.toHaveProperty("endsWith");
        expect(condition).not.toHaveProperty("lt");
        expect(condition).not.toHaveProperty("gt");
        expect(condition).not.toHaveProperty("gte");
      }),
      { numRuns: 100 }
    );
  });

  it("notEquals → { not: { equals, mode: 'insensitive' } }, kein anderer Schlüssel", () => {
    fc.assert(
      fc.property(nonEmptyString, (value) => {
        const result = buildPrismaWhereClause({
          field: { operator: FilterOperator.NotEquals, value }
        });
        const condition = result["field"] as Record<string, unknown>;
        expect(condition).toHaveProperty("not");
        const inner = condition["not"] as Record<string, unknown>;
        expect(inner).toHaveProperty("equals", value);
        expect(inner).toHaveProperty("mode", "insensitive");
        expect(condition).not.toHaveProperty("equals");
        expect(condition).not.toHaveProperty("contains");
        expect(condition).not.toHaveProperty("lt");
        expect(condition).not.toHaveProperty("gt");
        expect(condition).not.toHaveProperty("gte");
      }),
      { numRuns: 100 }
    );
  });

  it("contains → { contains, mode: 'insensitive' }, kein anderer Schlüssel", () => {
    fc.assert(
      fc.property(nonEmptyString, (value) => {
        const result = buildPrismaWhereClause({
          field: { operator: FilterOperator.Contains, value }
        });
        const condition = result["field"] as Record<string, unknown>;
        expect(condition).toHaveProperty("contains", value);
        expect(condition).toHaveProperty("mode", "insensitive");
        expect(condition).not.toHaveProperty("equals");
        expect(condition).not.toHaveProperty("startsWith");
        expect(condition).not.toHaveProperty("endsWith");
        expect(condition).not.toHaveProperty("lt");
        expect(condition).not.toHaveProperty("gt");
        expect(condition).not.toHaveProperty("gte");
      }),
      { numRuns: 100 }
    );
  });

  it("startsWith → { startsWith, mode: 'insensitive' }, kein anderer Schlüssel", () => {
    fc.assert(
      fc.property(nonEmptyString, (value) => {
        const result = buildPrismaWhereClause({
          field: { operator: FilterOperator.StartsWith, value }
        });
        const condition = result["field"] as Record<string, unknown>;
        expect(condition).toHaveProperty("startsWith", value);
        expect(condition).toHaveProperty("mode", "insensitive");
        expect(condition).not.toHaveProperty("equals");
        expect(condition).not.toHaveProperty("contains");
        expect(condition).not.toHaveProperty("endsWith");
        expect(condition).not.toHaveProperty("lt");
        expect(condition).not.toHaveProperty("gt");
        expect(condition).not.toHaveProperty("gte");
      }),
      { numRuns: 100 }
    );
  });

  it("endsWith → { endsWith, mode: 'insensitive' }, kein anderer Schlüssel", () => {
    fc.assert(
      fc.property(nonEmptyString, (value) => {
        const result = buildPrismaWhereClause({
          field: { operator: FilterOperator.EndsWith, value }
        });
        const condition = result["field"] as Record<string, unknown>;
        expect(condition).toHaveProperty("endsWith", value);
        expect(condition).toHaveProperty("mode", "insensitive");
        expect(condition).not.toHaveProperty("equals");
        expect(condition).not.toHaveProperty("contains");
        expect(condition).not.toHaveProperty("startsWith");
        expect(condition).not.toHaveProperty("lt");
        expect(condition).not.toHaveProperty("gt");
        expect(condition).not.toHaveProperty("gte");
      }),
      { numRuns: 100 }
    );
  });

  // ── Date operators ────────────────────────────────────────────────────────

  it("before → { lt: Date }, kein gt/gte", () => {
    fc.assert(
      fc.property(isoDateString, (value) => {
        const result = buildPrismaWhereClause({
          field: { operator: FilterOperator.Before, value }
        });
        const condition = result["field"] as Record<string, unknown>;
        expect(condition).toHaveProperty("lt");
        expect(condition["lt"]).toBeInstanceOf(Date);
        expect((condition["lt"] as Date).toISOString()).toBe(
          new Date(value).toISOString()
        );
        expect(condition).not.toHaveProperty("gt");
        expect(condition).not.toHaveProperty("gte");
        expect(condition).not.toHaveProperty("equals");
        expect(condition).not.toHaveProperty("contains");
      }),
      { numRuns: 100 }
    );
  });

  it("after → { gt: Date }, kein lt/gte", () => {
    fc.assert(
      fc.property(isoDateString, (value) => {
        const result = buildPrismaWhereClause({
          field: { operator: FilterOperator.After, value }
        });
        const condition = result["field"] as Record<string, unknown>;
        expect(condition).toHaveProperty("gt");
        expect(condition["gt"]).toBeInstanceOf(Date);
        expect((condition["gt"] as Date).toISOString()).toBe(
          new Date(value).toISOString()
        );
        expect(condition).not.toHaveProperty("lt");
        expect(condition).not.toHaveProperty("gte");
        expect(condition).not.toHaveProperty("equals");
        expect(condition).not.toHaveProperty("contains");
      }),
      { numRuns: 100 }
    );
  });

  it("onDate → { gte: startOfDay, lt: nextDay }, deckt genau einen Kalendertag ab", () => {
    fc.assert(
      fc.property(isoDateString, (value) => {
        const result = buildPrismaWhereClause({
          field: { operator: FilterOperator.OnDate, value }
        });
        const condition = result["field"] as Record<string, unknown>;
        expect(condition).toHaveProperty("gte");
        expect(condition).toHaveProperty("lt");
        expect(condition["gte"]).toBeInstanceOf(Date);
        expect(condition["lt"]).toBeInstanceOf(Date);

        const gte = condition["gte"] as Date;
        const lt = condition["lt"] as Date;
        const parsedDate = new Date(value);

        // lt must be exactly one day after gte
        const diffMs = lt.getTime() - gte.getTime();
        expect(diffMs).toBe(24 * 60 * 60 * 1000);

        // gte must correspond to the same calendar day as the input
        expect(gte.toISOString()).toBe(parsedDate.toISOString());

        expect(condition).not.toHaveProperty("gt");
        expect(condition).not.toHaveProperty("equals");
        expect(condition).not.toHaveProperty("contains");
      }),
      { numRuns: 100 }
    );
  });

  // ── Multiple filters combined (AND semantics) ─────────────────────────────

  it("mehrere Filter werden als UND kombiniert — jeder Schlüssel ist unabhängig übersetzt", () => {
    fc.assert(
      fc.property(filterState, (filter) => {
        const result = buildPrismaWhereClause(filter);

        for (const [key, entry] of Object.entries(filter)) {
          const condition = result[key] as Record<string, unknown>;
          expect(condition).toBeDefined();

          // Spot-check: the condition object matches the expected shape for the operator.
          switch (entry.operator) {
            case FilterOperator.Equals:
              expect(condition).toHaveProperty("equals");
              break;
            case FilterOperator.NotEquals:
              expect(condition).toHaveProperty("not");
              break;
            case FilterOperator.Contains:
              expect(condition).toHaveProperty("contains");
              break;
            case FilterOperator.StartsWith:
              expect(condition).toHaveProperty("startsWith");
              break;
            case FilterOperator.EndsWith:
              expect(condition).toHaveProperty("endsWith");
              break;
            case FilterOperator.Before:
              expect(condition).toHaveProperty("lt");
              expect(condition).not.toHaveProperty("gt");
              break;
            case FilterOperator.After:
              expect(condition).toHaveProperty("gt");
              expect(condition).not.toHaveProperty("lt");
              break;
            case FilterOperator.OnDate:
              expect(condition).toHaveProperty("gte");
              expect(condition).toHaveProperty("lt");
              break;
          }
        }
      }),
      { numRuns: 100 }
    );
  });
});
