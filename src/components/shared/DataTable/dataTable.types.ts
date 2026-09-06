import type React from "react";

// ─── Enums ───────────────────────────────────────────────────────────────────

export enum ColumnType {
  Text = "text",
  Email = "email",
  Date = "date",
  Role = "role",
  Custom = "custom"
}

export enum FilterOperator {
  Equals = "equals",
  NotEquals = "notEquals",
  Contains = "contains",
  StartsWith = "startsWith",
  EndsWith = "endsWith",
  Before = "before",
  After = "after",
  OnDate = "onDate"
}

// ─── Operator labels ──────────────────────────────────────────────────────────

export const OPERATOR_LABELS: Record<FilterOperator, string> = {
  [FilterOperator.Equals]: "Gleich",
  [FilterOperator.NotEquals]: "Ungleich",
  [FilterOperator.Contains]: "Enthält",
  [FilterOperator.StartsWith]: "Beginnt mit",
  [FilterOperator.EndsWith]: "Endet mit",
  [FilterOperator.Before]: "Vor",
  [FilterOperator.After]: "Nach",
  [FilterOperator.OnDate]: "Genau am"
};

// ─── Operator map ─────────────────────────────────────────────────────────────

// Allowed operators per ColumnType; Custom has no filter operators.
export const OPERATORS_BY_TYPE: Record<ColumnType, FilterOperator[]> = {
  [ColumnType.Text]: [
    FilterOperator.Equals,
    FilterOperator.NotEquals,
    FilterOperator.Contains,
    FilterOperator.StartsWith,
    FilterOperator.EndsWith
  ],
  [ColumnType.Email]: [
    FilterOperator.Equals,
    FilterOperator.NotEquals,
    FilterOperator.Contains,
    FilterOperator.StartsWith,
    FilterOperator.EndsWith
  ],
  [ColumnType.Date]: [
    FilterOperator.Before,
    FilterOperator.After,
    FilterOperator.OnDate
  ],
  [ColumnType.Role]: [FilterOperator.Equals, FilterOperator.NotEquals],
  [ColumnType.Custom]: []
};

// ─── Filter ──────────────────────────────────────────────────────────────────

export interface TFilterEntry {
  operator: FilterOperator;
  value: string;
}

// Partial<Record> allows only a subset of columns to be filtered at once.
export type TFilterState<T> = Partial<Record<keyof T, TFilterEntry>>;

// ─── Sort ────────────────────────────────────────────────────────────────────

export type TSortDirection = "asc" | "desc";

export interface TSortState<T> {
  key: keyof T;
  direction: TSortDirection;
}

// ─── Pagination ──────────────────────────────────────────────────────────────

export interface TPaginationState {
  cursor: string | null;
  pageSize: number;
}

// ─── Query Input ─────────────────────────────────────────────────────────────

export interface TQueryInput<T> {
  filter?: TFilterState<T>;
  sort?: TSortState<T>;
  pagination?: TPaginationState;
}

// ─── Server Response ─────────────────────────────────────────────────────────

export interface TPagedResult<T> {
  items: T[];
  nextCursor: string | null;
  hasNextPage: boolean;
}

// ─── ColumnDef ───────────────────────────────────────────────────────────────

// CellRenderer receives the entire row and returns React content.
export type TCellRenderer<T> = (row: T) => React.ReactNode;

// Base interface shared by all column types.
interface TColumnDefBase<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
}

// For type !== "custom": render is optional.
interface TColumnDefStandard<T> extends TColumnDefBase<T> {
  type: ColumnType.Text | ColumnType.Email | ColumnType.Date | ColumnType.Role;
  render?: TCellRenderer<T>;
}

// For type === "custom": render is required.
interface TColumnDefCustom<T> extends TColumnDefBase<T> {
  type: ColumnType.Custom;
  render: TCellRenderer<T>;
}

// Discriminated union: TypeScript enforces `render` only for type === "custom".
export type TColumnDef<T> = TColumnDefStandard<T> | TColumnDefCustom<T>;

// ─── QueryFn ─────────────────────────────────────────────────────────────────

// Return shape mirrors React Query's useQuery result.
export interface TQueryResult<T> {
  data: TPagedResult<T> | undefined;
  isLoading: boolean;
  isFetching: boolean;
  error: unknown;
}

// Defined as an interface (not a type alias) so typescript-eslint can fully
// resolve the call signature and avoid spurious no-unsafe-call errors.
export interface TQueryFn<T> {
  (input: TQueryInput<T>): TQueryResult<T>;
}

// ─── DataTable Props ─────────────────────────────────────────────────────────

// T extends { id: string } is required for cursor-based pagination (Prisma cursor: { id: string }).
export interface IDataTableProps<T extends { id: string }> {
  columns: TColumnDef<T>[];
  queryFn: TQueryFn<T>;
  defaultPageSize?: number; // Default: 25
}
