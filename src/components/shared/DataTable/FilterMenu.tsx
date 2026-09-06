import React, { useState } from "react";
import {
  Popover,
  Select,
  TextInput,
  Button,
  Stack,
  Group
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import type { TColumnDef, TFilterEntry } from "./dataTable.types";
import {
  ColumnType,
  FilterOperator,
  OPERATOR_LABELS,
  OPERATORS_BY_TYPE
} from "./dataTable.types";

interface IFilterMenuProps<T> {
  column: TColumnDef<T>;
  currentFilter: TFilterEntry | undefined;
  onApply: (entry: TFilterEntry) => void;
  onClear: () => void;
  children: React.ReactNode; // Trigger element (e.g. ActionIcon)
}

function FilterMenu<T>({
  column,
  currentFilter,
  onApply,
  onClear,
  children
}: IFilterMenuProps<T>) {
  // Custom columns have no filter operators — render only the trigger element.
  if (column.type === ColumnType.Custom) {
    return <>{children}</>;
  }

  const availableOperators = OPERATORS_BY_TYPE[column.type];
  const defaultOperator =
    currentFilter?.operator ?? availableOperators[0] ?? FilterOperator.Equals;

  const [opened, setOpened] = useState(false);
  const [operator, setOperator] = useState<FilterOperator>(defaultOperator);
  const [value, setValue] = useState<string>(currentFilter?.value ?? "");
  const [dateValue, setDateValue] = useState<Date | null>(
    currentFilter?.value ? new Date(currentFilter.value) : null
  );

  const isDate = column.type === ColumnType.Date;

  const handleApply = () => {
    const finalValue = isDate ? (dateValue?.toISOString() ?? "") : value;
    if (!finalValue) return;
    onApply({ operator, value: finalValue });
    setOpened(false);
  };

  const handleClear = () => {
    setValue("");
    setDateValue(null);
    onClear();
    setOpened(false);
  };

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="bottom-start"
      withArrow
      shadow="md"
    >
      <Popover.Target>
        <span
          style={{ display: "inline-flex" }}
          onClick={() => setOpened((o) => !o)}
        >
          {children}
        </span>
      </Popover.Target>

      <Popover.Dropdown>
        <Stack gap="xs" w={260}>
          {/* withinPortal: false keeps the dropdown in the same DOM tree as the
              Popover so outside-click detection works correctly */}
          <Select
            label="Operator"
            size="xs"
            value={operator}
            onChange={(v) => v && setOperator(v as FilterOperator)}
            comboboxProps={{ withinPortal: false }}
            data={availableOperators.map((op) => ({
              value: op,
              label: OPERATOR_LABELS[op]
            }))}
          />

          {isDate ? (
            <DatePickerInput
              label="Datum"
              size="xs"
              value={dateValue}
              onChange={setDateValue}
              placeholder="Datum wählen"
              clearable
              popoverProps={{ withinPortal: false }}
            />
          ) : (
            <TextInput
              label="Wert"
              size="xs"
              value={value}
              onChange={(e) => setValue(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleApply();
              }}
            />
          )}

          <Group justify="flex-end" gap="xs">
            <Button variant="subtle" size="xs" onClick={handleClear}>
              Löschen
            </Button>
            <Button size="xs" onClick={handleApply}>
              Anwenden
            </Button>
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

export { FilterMenu };
