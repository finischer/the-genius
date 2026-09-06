export { default } from "./DataTable";
export { default as DataTable } from "./DataTable";

// Runtime values — regular exports
export {
  ColumnType,
  FilterOperator,
  OPERATORS_BY_TYPE
} from "./dataTable.types";

// Type-only exports (verbatimModuleSyntax: true)
export type {
  TCellRenderer,
  TColumnDef,
  TFilterEntry,
  TFilterState,
  TSortDirection,
  TSortState,
  TPaginationState,
  TQueryInput,
  TPagedResult,
  TQueryResult,
  TQueryFn,
  IDataTableProps
} from "./dataTable.types";
