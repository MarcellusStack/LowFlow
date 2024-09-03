"use client";
import { ActionIcon, Group, Text } from "@mantine/core";
import { MantineTable } from "@components/mantine-table";
import { tableColumnProps } from "@constants/index";
import { ViewActionIcon } from "@components/view-action-icon";
import { DeleteActionIcon } from "@components/delete-action-icon";
import { UpdateModalActionIcon } from "@components/update-modal-action-icon";
import {
  deleteWorkflowProcess,
  moveDown,
  moveUp,
  WorkflowProcessesProps,
} from "../_actions";
import { WorkflowProcessForm } from "./workflow-process-form";
import { PresentationStatusBadge } from "@components/presentation-badge";
import { PreviewProcess } from "../../../../processes/_components/preview-process";
import { ActionIconAction } from "@components/action-icon-action";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";

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
          accessor: "n8nWorkflows",
          title: "n8n Workflows",
          render: ({ n8nWorkflows }) => (
            <Text size="sm">{n8nWorkflows.length}</Text>
          ),
          ...tableColumnProps,
        },
        {
          accessor: "actions",
          title: "Aktionen",
          width: "0%",
          render: (process, index) => (
            <Group gap={0} justify="flex-end" wrap="nowrap">
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
              <PreviewProcess json={process.fields} />
              <ActionIconAction
                values={{ id: process.id }}
                action={moveUp}
                disabled={index === 0}
              >
                <IconArrowUp
                  style={{ width: "70%", height: "70%" }}
                  stroke={1.5}
                />
              </ActionIconAction>
              <ActionIconAction
                values={{ id: process.id }}
                action={moveDown}
                disabled={index === processes.length - 1}
              >
                <IconArrowDown
                  style={{ width: "70%", height: "70%" }}
                  stroke={1.5}
                />
              </ActionIconAction>
            </Group>
          ),
          ...tableColumnProps,
        },
      ]}
      storeKey="workflow-processes-table"
    />
  );
};
