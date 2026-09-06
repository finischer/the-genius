import { describe, it } from "vitest";
import * as fc from "fast-check";

// ── Pure function under test ──────────────────────────────────────────────────
//
// Extracted from users.getAll — the pagination calculation is a pure
// transformation on the raw DB result, so it can be tested without Prisma.

function computePagedResult<T extends { id: string }>(
  rawItems: T[],
  pageSize: number
): { items: T[]; nextCursor: string | null; hasNextPage: boolean } {
  const hasNextPage = rawItems.length > pageSize;
  const items = hasNextPage ? rawItems.slice(0, pageSize) : rawItems;
  const nextCursor = hasNextPage ? (items[items.length - 1]?.id ?? null) : null;
  return { items, nextCursor, hasNextPage };
}

// ── Arbitraries ───────────────────────────────────────────────────────────────

const arbitraryItem = fc
  .string({ minLength: 1, maxLength: 32 })
  .map((id) => ({ id }));

// ── Property tests ────────────────────────────────────────────────────────────

describe("computePagedResult — pagination invariants", () => {
  it("4a: hasNextPage iff rawItems.length > pageSize", () => {
    fc.assert(
      fc.property(
        fc
          .integer({ min: 1, max: 50 })
          .chain((pageSize) =>
            fc
              .array(arbitraryItem, { minLength: 0, maxLength: pageSize + 5 })
              .map((rawItems) => ({ rawItems, pageSize }))
          ),
        ({ rawItems, pageSize }) => {
          const { hasNextPage } = computePagedResult(rawItems, pageSize);
          return hasNextPage === rawItems.length > pageSize;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("4b: items.length === pageSize when hasNextPage is true", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 50 }).chain((pageSize) =>
          fc
            .array(arbitraryItem, {
              minLength: pageSize + 1,
              maxLength: pageSize + 50
            })
            .map((rawItems) => ({ rawItems, pageSize }))
        ),
        ({ rawItems, pageSize }) => {
          const result = computePagedResult(rawItems, pageSize);
          return result.hasNextPage && result.items.length === pageSize;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("4c: items.length === rawItems.length when hasNextPage is false", () => {
    fc.assert(
      fc.property(
        fc
          .integer({ min: 1, max: 50 })
          .chain((pageSize) =>
            fc
              .array(arbitraryItem, { minLength: 0, maxLength: pageSize })
              .map((rawItems) => ({ rawItems, pageSize }))
          ),
        ({ rawItems, pageSize }) => {
          const result = computePagedResult(rawItems, pageSize);
          return !result.hasNextPage && result.items.length === rawItems.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("4d: nextCursor === last item id when hasNextPage is true", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 50 }).chain((pageSize) =>
          fc
            .array(arbitraryItem, {
              minLength: pageSize + 1,
              maxLength: pageSize + 50
            })
            .map((rawItems) => ({ rawItems, pageSize }))
        ),
        ({ rawItems, pageSize }) => {
          const result = computePagedResult(rawItems, pageSize);
          const expectedCursor = result.items[pageSize - 1]?.id ?? null;
          return result.nextCursor === expectedCursor;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("4e: nextCursor is null when hasNextPage is false", () => {
    fc.assert(
      fc.property(
        fc
          .integer({ min: 1, max: 50 })
          .chain((pageSize) =>
            fc
              .array(arbitraryItem, { minLength: 0, maxLength: pageSize })
              .map((rawItems) => ({ rawItems, pageSize }))
          ),
        ({ rawItems, pageSize }) => {
          const result = computePagedResult(rawItems, pageSize);
          return !result.hasNextPage && result.nextCursor === null;
        }
      ),
      { numRuns: 100 }
    );
  });
});
