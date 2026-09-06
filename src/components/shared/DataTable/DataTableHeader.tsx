import React from "react";
import { Table, Group, ActionIcon, Text } from "@mantine/core";
import {
  IconChevronUp,
  IconChevronDown,
  IconFilter,
  IconFilterFilled
} from "@tabler/icons-react";
import type { TColumnDef, TFilterState, TSortState } from "./dataTable.types";
import { FilterMenu } from "./FilterMenu";

interface IDataTableHeaderProps<T> {
  columns: TColumnDef<T>[];
  sortState: TSortState<T> | null;
  filterState: TFilterState<T>;
  onSort: (key: keyof T) => void;
  onFilterChange: (filter: TFilterState<T>) => void;
}

function DataTableHeader<T>({
  columns,
  sortState,
  filterState,
  onSort,
  onFilterChange
}: IDataTableHeaderProps<T>) {
  return (
    <Table.Thead>
      <Table.Tr>
        {columns.map((col) => {
          const isActiveSortColumn = sortState?.key === col.key;
          const hasActiveFilter = Boolean(filterState[col.key]);

          return (
            <Table.Th key={String(col.key)}>
              <Group gap={4} wrap="nowrap">
                {/* Sort icon — only for sortable columns */}
                {col.sortable ? (
                  <ActionIcon
                    variant="subtle"
                    size="sm"
                    onClick={() => onSort(col.key)}
                    aria-label={`Sortieren nach ${col.label}`}
                  >
                    {isActiveSortColumn && sortState?.direction === "asc" ? (
                      <IconChevronUp size={14} />
                    ) : isActiveSortColumn &&
                      sortState?.direction === "desc" ? (
                      <IconChevronDown size={14} />
                    ) : (
                      <IconChevronUp size={14} style={{ opacity: 0.3 }} />
                    )}
                  </ActionIcon>
                ) : null}

                <Text size="sm" fw={600}>
                  {col.label}
                </Text>

                {/* Filter icon — only for filterable columns */}
                {col.filterable ? (
                  <FilterMenu
                    column={col}
                    currentFilter={filterState[col.key]}
                    onApply={(entry) =>
                      onFilterChange({ ...filterState, [col.key]: entry })
                    }
                    onClear={() => {
                      const next = { ...filterState };
                      delete next[col.key];
                      onFilterChange(next);
                    }}
                  >
                    <ActionIcon
                      variant="subtle"
                      size="sm"
                      aria-label={`Filter für ${col.label}`}
                    >
                      {hasActiveFilter ? (
                        <IconFilterFilled size={14} />
                      ) : (
                        <IconFilter size={14} />
                      )}
                    </ActionIcon>
                  </FilterMenu>
                ) : null}
              </Group>
            </Table.Th>
          );
        })}
      </Table.Tr>
    </Table.Thead>
  );
}

export { DataTableHeader };
