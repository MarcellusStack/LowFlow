"use client";
import { Group, Text } from "@mantine/core";
import { MantineTable } from "@components/mantine-table";
import { tableColumnProps } from "@constants/index";
import { ViewActionIcon } from "@components/view-action-icon";
import { DeleteActionIcon } from "@components/delete-action-icon";
import { UpdateModalActionIcon } from "@components/update-modal-action-icon";
import { deleteWorkflowProcess, WorkflowProcessesProps } from "../_actions";
import { WorkflowProcessForm } from "./workflow-process-form";
import { PresentationStatusBadge } from "@components/presentation-badge";

export const WorkflowProcessesTable = ({
  processes,
}: {
  processes: WorkflowProcessesProps;
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
                content={
                  <WorkflowProcessForm
                    workflowId={process.workflowId}
                    process={process}
                  />
                }
              />
              <DeleteActionIcon
                id={process.id}
                action={deleteWorkflowProcess}
                entity="Process"
              />
            </Group>
          ),
          ...tableColumnProps,
        },
      ]}
      storeKey="workflow-processes-table"
    />
  );
};
