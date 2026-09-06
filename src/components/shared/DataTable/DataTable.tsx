import React, { useState } from "react";
import { Box, Table, Center, Text, Loader, Button, Group } from "@mantine/core";
import { IconFilterOff } from "@tabler/icons-react";
import type { IDataTableProps } from "./dataTable.types";
import { DataTableHeader } from "./DataTableHeader";
import { DataTablePagination } from "./DataTablePagination";
import { useDataTableUrlState } from "~/hooks/useDataTableUrlState";

function DataTable<T extends { id: string }>({
  columns,
  queryFn,
  defaultPageSize = 25
}: IDataTableProps<T>) {
  const { filterState, sortState, paginationState, updateUrl } =
    useDataTableUrlState<T>(defaultPageSize);

  const [cursorStack, setCursorStack] = useState<string[]>([]);

  const { data, isLoading } = queryFn({
    filter: filterState,
    sort: sortState ?? undefined,
    pagination: paginationState
  });

  // ── Sort ──────────────────────────────────────────────────────────────────

  const handleSort = (key: keyof T) => {
    let newSort = sortState;
    if (sortState?.key === key) {
      newSort =
        sortState.direction === "asc" ? { key, direction: "desc" } : null;
    } else {
      newSort = { key, direction: "asc" };
    }
    updateUrl(filterState, newSort, null);
    setCursorStack([]);
  };

  // ── Filter ────────────────────────────────────────────────────────────────

  const handleFilterChange = (newFilter: typeof filterState) => {
    updateUrl(newFilter, sortState, null);
    setCursorStack([]);
  };

  const handleClearAllFilters = () => {
    updateUrl({}, sortState, null);
    setCursorStack([]);
  };

  const hasActiveFilters = Object.keys(filterState).length > 0;

  // ── Pagination ────────────────────────────────────────────────────────────

  const handleNext = () => {
    if (!data?.nextCursor) return;
    const currentCursor = paginationState.cursor ?? "";
    setCursorStack((prev) => [...prev, currentCursor]);
    updateUrl(filterState, sortState, data.nextCursor);
  };

  const handleBack = () => {
    const previous = cursorStack[cursorStack.length - 1] ?? null;
    setCursorStack((stack) => stack.slice(0, -1));
    updateUrl(filterState, sortState, previous);
  };

  const hasPreviousPage = paginationState.cursor !== null;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Box>
      {hasActiveFilters && (
        <Group justify="flex-end" mb="xs">
          <Button
            variant="subtle"
            size="xs"
            color="red"
            leftSection={<IconFilterOff size={14} />}
            onClick={handleClearAllFilters}
          >
            Alle Filter zurücksetzen
          </Button>
        </Group>
      )}

      {isLoading && (
        <Center py="md">
          <Loader size="sm" />
        </Center>
      )}

      <Table verticalSpacing="sm" stickyHeader>
        <DataTableHeader
          columns={columns}
          sortState={sortState}
          filterState={filterState}
          onSort={handleSort}
          onFilterChange={handleFilterChange}
        />
        <Table.Tbody>
          {data?.items.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={columns.length}>
                <Center py="md">
                  <Text c="dimmed">Keine Einträge gefunden</Text>
                </Center>
              </Table.Td>
            </Table.Tr>
          ) : (
            data?.items.map((row) => (
              <Table.Tr key={row.id}>
                {columns.map((col) => (
                  <Table.Td key={String(col.key)}>
                    {col.render ? col.render(row) : String(row[col.key] ?? "-")}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>

      {/* Sticks to the bottom of the viewport as the page scrolls */}
      <Box
        py="sm"
        style={{
          position: "sticky",
          bottom: 0,
          backgroundColor: "var(--mantine-color-body)",
          borderTop: "1px solid var(--mantine-color-dark-4)"
        }}
      >
        <DataTablePagination
          hasNextPage={data?.hasNextPage ?? false}
          hasPreviousPage={hasPreviousPage}
          onNext={handleNext}
          onBack={handleBack}
        />
      </Box>
    </Box>
  );
}

export default DataTable;
