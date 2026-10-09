import * as fc from "fast-check";

// ── Pure state machine (mirrors DataTable's handleSort / handleFilterChange) ──

type SortKey = string;

interface DataTableState {
  cursor: string | null;
  cursorStack: string[];
  sortKey: SortKey | null;
  sortDirection: "asc" | "desc" | null;
  filter: Record<string, unknown>;
}

function applySort(state: DataTableState, key: SortKey): DataTableState {
  let newDirection: "asc" | "desc" | null;
  if (state.sortKey === key) {
    if (state.sortDirection === "asc") newDirection = "desc";
    else newDirection = null;
  } else {
    newDirection = "asc";
  }
  return {
    ...state,
    sortKey: newDirection === null ? null : key,
    sortDirection: newDirection,
    cursor: null,
    cursorStack: []
  };
}

function applyFilter(
  state: DataTableState,
  filter: Record<string, unknown>
): DataTableState {
  return {
    ...state,
    filter,
    cursor: null,
    cursorStack: []
  };
}

// ── Arbitraries ───────────────────────────────────────────────────────────────

const arbitraryCursor = fc.oneof(
  fc.constant(null),
  fc.string({ minLength: 1, maxLength: 32 })
);

const arbitraryCursorStack = fc.array(
  fc.string({ minLength: 1, maxLength: 32 }),
  { minLength: 0, maxLength: 5 }
);

const arbitraryKey = fc
  .string({ minLength: 1, maxLength: 32 })
  .filter((s) => s.trim().length > 0);

const arbitraryDirection = fc.oneof(
  fc.constant(null),
  fc.constant("asc" as const),
  fc.constant("desc" as const)
);

const arbitraryFilter = fc.dictionary(
  fc.string({ minLength: 1, maxLength: 16 }),
  fc.oneof(fc.string(), fc.integer(), fc.boolean()),
  { minKeys: 0, maxKeys: 4 }
) as fc.Arbitrary<Record<string, unknown>>;

const arbitraryState: fc.Arbitrary<DataTableState> = fc
  .tuple(
    arbitraryCursor,
    arbitraryCursorStack,
    fc.oneof(fc.constant(null), arbitraryKey),
    arbitraryDirection,
    arbitraryFilter
  )
  .map(([cursor, cursorStack, sortKey, sortDirection, filter]) => ({
    cursor,
    cursorStack,
    sortKey,
    sortDirection,
    filter
  }));

// ── Unit tests ────────────────────────────────────────────────────────────────

describe("applySort — unit tests", () => {
  it("preserves filter after a sort change", () => {
    const state: DataTableState = {
      cursor: "abc",
      cursorStack: ["x", "y"],
      sortKey: null,
      sortDirection: null,
      filter: { role: "ADMIN" }
    };
    const result = applySort(state, "email");
    expect(result.filter).toEqual({ role: "ADMIN" });
  });

  it("resets cursor and cursorStack after sort on a different key", () => {
    const state: DataTableState = {
      cursor: "cursor-42",
      cursorStack: ["a", "b", "c"],
      sortKey: "username",
      sortDirection: "asc",
      filter: {}
    };
    const result = applySort(state, "email");
    expect(result.cursor).toBeNull();
    expect(result.cursorStack).toEqual([]);
  });
});

describe("applyFilter — unit tests", () => {
  it("preserves sort state after a filter change", () => {
    const state: DataTableState = {
      cursor: "abc",
      cursorStack: ["x"],
      sortKey: "createdAt",
      sortDirection: "desc",
      filter: {}
    };
    const result = applyFilter(state, { role: "USER" });
    expect(result.sortKey).toBe("createdAt");
    expect(result.sortDirection).toBe("desc");
  });

  it("resets cursor and cursorStack after filter change", () => {
    const state: DataTableState = {
      cursor: "cursor-99",
      cursorStack: ["p", "q"],
      sortKey: null,
      sortDirection: null,
      filter: {}
    };
    const result = applyFilter(state, { email: "test" });
    expect(result.cursor).toBeNull();
    expect(result.cursorStack).toEqual([]);
  });
});

// ── Property tests ────────────────────────────────────────────────────────────

describe("Filter-/Sort-Änderung setzt Paginierung zurück", () => {
  it("7a: applySort always yields cursor === null and cursorStack === []", () => {
    fc.assert(
      fc.property(arbitraryState, arbitraryKey, (state, key) => {
        const result = applySort(state, key);
        expect(result.cursor).toBeNull();
        expect(result.cursorStack).toEqual([]);
      }),
      { numRuns: 100 }
    );
  });

  it("7b: applyFilter always yields cursor === null and cursorStack === []", () => {
    fc.assert(
      fc.property(arbitraryState, arbitraryFilter, (state, filter) => {
        const result = applyFilter(state, filter);
        expect(result.cursor).toBeNull();
        expect(result.cursorStack).toEqual([]);
      }),
      { numRuns: 100 }
    );
  });

  it("7c: sort resets to page 1 even from deep pagination state", () => {
    const deepPaginationState = fc.integer({ min: 1, max: 10 }).chain((depth) =>
      fc
        .array(fc.string({ minLength: 1, maxLength: 32 }), {
          minLength: depth,
          maxLength: depth
        })
        .chain((stack) =>
          fc.string({ minLength: 1, maxLength: 32 }).map((cursor) => ({
            cursor,
            cursorStack: stack,
            sortKey: null,
            sortDirection: null,
            filter: {}
          }))
        )
    ) as fc.Arbitrary<DataTableState>;

    fc.assert(
      fc.property(deepPaginationState, arbitraryKey, (state, key) => {
        expect(state.cursorStack.length).toBeGreaterThan(0);
        expect(state.cursor).not.toBeNull();

        const result = applySort(state, key);
        expect(result.cursor).toBeNull();
        expect(result.cursorStack).toEqual([]);
      }),
      { numRuns: 100 }
    );
  });
});
