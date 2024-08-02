import { Button, Group, Stack } from "@mantine/core";
import {
  DataTable,
  DataTableColumn,
  DataTableRowExpansionProps,
  useDataTableColumns,
} from "mantine-datatable";
import React from "react";

type MantineTableProps<T> = {
  columns: DataTableColumn<T>[];
  records: T[];
  storeKey: string;
  height?: number;
  minHeightRecords?: number;
  hideColumnsToggle?: boolean;
  classes?: {
    root?: string;
    table?: string;
    header?: string;
    footer?: string;
    pagination?: string;
  };
  rowExpansion?: DataTableRowExpansionProps<T> | undefined;
};

export const MantineTable = <T,>({
  columns,
  records,
  storeKey,
  height,
  minHeightRecords,
  hideColumnsToggle = false,
  rowExpansion,
}: MantineTableProps<T>) => {
  const {
    effectiveColumns,
    resetColumnsWidth,
    resetColumnsOrder,
    resetColumnsToggle,
  } = useDataTableColumns({
    key: storeKey,
    columns: columns as DataTableColumn<unknown>[],
  });
  return (
    <Stack>
      <DataTable
        {...(height && minHeightRecords && records.length > minHeightRecords
          ? { height }
          : {})}
        withTableBorder
        borderRadius="sm"
        striped
        minHeight={records.length === 0 ? 150 : 0}
        noRecordsText="No records found"
        storeColumnsKey={storeKey}
        columns={effectiveColumns}
        records={records}
        rowExpansion={rowExpansion}
      />
      {hideColumnsToggle ? null : (
        <Group justify="right">
          <Button
            color="black"
            variant="light"
            size="compact-xs"
            onClick={resetColumnsWidth}
          >
            Reset column width
          </Button>
          <Button
            color="black"
            variant="light"
            size="compact-xs"
            onClick={resetColumnsOrder}
          >
            Reset column arrangement
          </Button>
          <Button
            color="black"
            variant="light"
            size="compact-xs"
            onClick={resetColumnsToggle}
          >
            Reset columns
          </Button>
        </Group>
      )}
    </Stack>
  );
};
