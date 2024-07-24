"use client";
import { Group, Text } from "@mantine/core";
import { MantineTable } from "@components/mantine-table";
import { tableColumnProps } from "@constants/index";
import { ViewActionIcon } from "@components/view-action-icon";
import { DeleteActionIcon } from "@components/delete-action-icon";
import { UpdateModalActionIcon } from "@components/update-modal-action-icon";
import { deleteProcess, ProcessesProps } from "../_actions";
import { PresentationStatusBadge } from "@components/presentation-badge";
import { ProcessForm } from "./process-form";

export const ProcessesTable = ({
  processes,
}: {
  processes: ProcessesProps;
}) => {
  return (
    <MantineTable
      records={processes || []}
      columns={[
        {
          accessor: "status",
          title: "Status",
          render: ({ status }) => <PresentationStatusBadge status={status} />,
          ...tableColumnProps,
        },
        {
          accessor: "name",
          title: "Name",
          ...tableColumnProps,
        },
        {
          accessor: "description",
          title: "Description",
          ...tableColumnProps,
        },
        {
          accessor: "workflow.name",
          title: "Workflow",
          ...tableColumnProps,
        },
        {
          accessor: "n8nWorkflowIds",
          title: "n8n Workflows",
          render: ({ n8nWorkflowIds }) => (
            <Text size="sm">{n8nWorkflowIds.length}</Text>
          ),
          ...tableColumnProps,
        },
        {
          accessor: "actions",
          title: "Aktionen",
          width: "0%",
          render: (process) => (
            <Group gap={0} justify="flex-end">
              <ViewActionIcon href={`/processes/${process.id}`} />
              <UpdateModalActionIcon
                entity="Process"
                content={<ProcessForm process={process} />}
              />
              <DeleteActionIcon
                id={process.id}
                action={deleteProcess}
                entity="Process"
              />
            </Group>
          ),
          ...tableColumnProps,
        },
      ]}
      storeKey="processes-table"
    />
  );
};
