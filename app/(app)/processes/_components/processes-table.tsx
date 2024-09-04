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
import { PreviewProcess } from "./preview-process";

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
          accessor: "n8nCompleteWorkflows",
          title: "n8n Complete Workflows",
          render: ({ n8nCompleteWorkflows }) => (
            <Text size="sm">{n8nCompleteWorkflows.length}</Text>
          ),
          ...tableColumnProps,
        },
        {
          accessor: "n8nOngoingWorkflows",
          title: "n8n Ongoing Workflows",
          render: ({ n8nOngoingWorkflows }) => (
            <Text size="sm">{n8nOngoingWorkflows.length}</Text>
          ),
          ...tableColumnProps,
        },
        {
          accessor: "actions",
          title: "Aktionen",
          width: "0%",
          render: (process) => (
            <Group gap={0} justify="flex-end" wrap="nowrap">
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
              <PreviewProcess json={process.fields} />
            </Group>
          ),
          ...tableColumnProps,
        },
      ]}
      storeKey="processes-table"
    />
  );
};
