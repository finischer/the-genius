import React from "react";
import { Table, Group, ActionIcon, Text } from "@mantine/core";
import {
  IconChevronUp,
  IconChevronDown,
  IconSelector,
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
    <Table.Thead
      style={{
        backgroundColor: "var(--mantine-color-dark-6)",
        borderBottom: "2px solid var(--mantine-color-dark-4)"
      }}
    >
      <Table.Tr>
        {columns.map((col) => {
          const isActiveSortColumn = sortState?.key === col.key;
          const hasActiveFilter = Boolean(filterState[col.key]);

          return (
            <Table.Th
              key={String(col.key)}
              style={{ paddingTop: 12, paddingBottom: 12 }}
            >
              <Group gap={6} wrap="nowrap">
                {/* Sort icon — only for sortable columns */}
                {col.sortable ? (
                  <ActionIcon
                    variant="subtle"
                    size="md"
                    onClick={() => onSort(col.key)}
                    aria-label={`Sortieren nach ${col.label}`}
                  >
                    {isActiveSortColumn && sortState?.direction === "asc" ? (
                      <IconChevronUp size={16} />
                    ) : isActiveSortColumn &&
                      sortState?.direction === "desc" ? (
                      <IconChevronDown size={16} />
                    ) : (
                      <IconSelector size={16} style={{ opacity: 0.3 }} />
                    )}
                  </ActionIcon>
                ) : null}

                <Text
                  size="xs"
                  fw={700}
                  tt="uppercase"
                  style={{ letterSpacing: "0.06em" }}
                  c="dimmed"
                >
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
                      size="md"
                      color={hasActiveFilter ? "blue" : "gray"}
                      aria-label={`Filter für ${col.label}`}
                    >
                      {hasActiveFilter ? (
                        <IconFilterFilled size={16} />
                      ) : (
                        <IconFilter size={16} />
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
