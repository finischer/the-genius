import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import type {
  TFilterEntry,
  TFilterState,
  TPaginationState,
  TSortState
} from "~/components/shared/DataTable/dataTable.types";
import { FilterOperator } from "~/components/shared/DataTable/dataTable.types";

// ── Serialization ─────────────────────────────────────────────────────────────

export function serializeFilter<T>(
  filter: TFilterState<T>
): Record<string, string> {
  const params: Record<string, string> = {};
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  for (const [key, entry] of Object.entries(filter) as Array<
    [string, TFilterEntry | undefined]
  >) {
    if (entry) {
      params[`filter[${key}]`] = `${entry.operator}:${entry.value}`;
    }
  }
  return params;
}

export function serializeSort<T>(
  sort: TSortState<T> | null
): Record<string, string> {
  if (!sort) return {};
  return { sort: `${String(sort.key)}:${sort.direction}` };
}

// ── Deserialization ───────────────────────────────────────────────────────────

export function parseFilter<T>(
  query: Record<string, string | string[] | undefined>
): TFilterState<T> {
  const filter: TFilterState<T> = {};
  for (const [rawKey, rawValue] of Object.entries(query)) {
    const match = /^filter\[(.+)\]$/.exec(rawKey);
    if (!match?.[1]) continue;
    const key = match[1] as keyof T;
    const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
    if (!value) continue;
    const colonIdx = value.indexOf(":");
    if (colonIdx === -1) continue;
    const operator = value.slice(0, colonIdx) as FilterOperator;
    const filterValue = value.slice(colonIdx + 1);
    if (!Object.values(FilterOperator).includes(operator)) continue;
    filter[key] = { operator, value: filterValue };
  }
  return filter;
}

export function parseSort<T>(
  query: Record<string, string | string[] | undefined>
): TSortState<T> | null {
  const raw = Array.isArray(query.sort) ? query.sort[0] : query.sort;
  if (!raw) return null;
  const colonIdx = raw.indexOf(":");
  if (colonIdx === -1) return null;
  const key = raw.slice(0, colonIdx);
  const direction = raw.slice(colonIdx + 1);
  if (direction !== "asc" && direction !== "desc") return null;
  if (!key) return null;
  return { key: key as keyof T, direction };
}

export function parseCursor(
  query: Record<string, string | string[] | undefined>
): string | null {
  const raw = Array.isArray(query.cursor) ? query.cursor[0] : query.cursor;
  return raw ?? null;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useDataTableUrlState<T>(defaultPageSize = 25) {
  const router = useRouter();

  const filterState = useMemo(
    () =>
      parseFilter<T>(
        router.query as Record<string, string | string[] | undefined>
      ),
    [router.query]
  );

  const sortState = useMemo(
    () =>
      parseSort<T>(
        router.query as Record<string, string | string[] | undefined>
      ),
    [router.query]
  );

  const paginationState = useMemo<TPaginationState>(
    () => ({
      cursor: parseCursor(router.query),
      pageSize: defaultPageSize
    }),
    [router.query, defaultPageSize]
  );

  const updateUrl = useCallback(
    (
      newFilter: TFilterState<T>,
      newSort: TSortState<T> | null,
      newCursor: string | null
    ) => {
      const params: Record<string, string> = {
        ...serializeFilter(newFilter),
        ...serializeSort(newSort)
      };
      if (newCursor) params.cursor = newCursor;

      void router.replace(
        { pathname: router.pathname, query: params },
        undefined,
        { shallow: true }
      );
    },
    [router]
  );

  const setFilterState = useCallback(
    (newFilter: TFilterState<T>) => updateUrl(newFilter, sortState, null),
    [updateUrl, sortState]
  );

  const setSortState = useCallback(
    (newSort: TSortState<T> | null) => updateUrl(filterState, newSort, null),
    [updateUrl, filterState]
  );

  const setPaginationState = useCallback(
    (newPagination: TPaginationState) =>
      updateUrl(filterState, sortState, newPagination.cursor),
    [updateUrl, filterState, sortState]
  );

  return {
    filterState,
    sortState,
    paginationState,
    updateUrl,
    setFilterState,
    setSortState,
    setPaginationState
  };
}
