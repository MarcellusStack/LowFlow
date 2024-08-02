"use client";
import { Group } from "@mantine/core";
import { MantineTable } from "@components/mantine-table";
import { tableColumnProps } from "@constants/index";
import { deleteRun, RunsProps } from "../_actions";
import { ProcessStatusBadge } from "@components/process-status-badge";
import { DeleteActionIcon } from "@components/delete-action-icon";
import { ViewActionIcon } from "@components/view-action-icon";
import { useState } from "react";

export const RunsTable = ({ runs }: { runs: RunsProps }) => {
  const [expandedRunIds, setExpandedRunIds] = useState<string[]>([]);
  return (
    <MantineTable
      records={runs || []}
      columns={[
        {
          accessor: "id",
          title: "Id",
          ...tableColumnProps,
        },
        {
          accessor: "workflow.name",
          title: "Workflow",
          ...tableColumnProps,
        },
        {
          accessor: "status",
          title: "Status",
          render: ({ status }) => <ProcessStatusBadge status={status} />,
          ...tableColumnProps,
        },
        {
          accessor: "actions",
          title: "Aktionen",
          width: "0%",
          render: (run) => (
            <Group gap={0} justify="flex-end" wrap="nowrap">
              <ViewActionIcon href={`/runs/${run.id}`} />
              <DeleteActionIcon id={run.id} action={deleteRun} entity="Run" />
            </Group>
          ),
          ...tableColumnProps,
        },
      ]}
      storeKey="runs-table"
      rowExpansion={{
        allowMultiple: true,
        expanded: {
          recordIds: expandedRunIds,
          onRecordIdsChange: setExpandedRunIds,
        },
        content: (run) => <h1>Test</h1>,
      }}
    />
  );
};
