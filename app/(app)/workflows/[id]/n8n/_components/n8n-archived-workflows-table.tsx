"use client";
import { ActionIcon, Group, Title } from "@mantine/core";
import { MantineTable } from "@components/mantine-table";
import { tableColumnProps } from "@constants/index";
import {
  deleteN8nArchivedWorkflow,
  WorkflowN8nsProps,
} from "../_actions";
import { modals } from "@mantine/modals";
import { ButtonAction } from "@components/button-action";
import { IconTrash } from "@tabler/icons-react";
import { QuickSearchAdd } from "@components/quick-search-add";
import { CreateN8nCompleteWorkflowForm } from "./create-n8n-complete-workflow-form";
import { CreateN8nArchivedWorkflowForm } from "./create-n8n-archived-workflow-form";

export const N8nArchivedWorkflowsTable = ({
  workflowId,
  n8ns,
}: {
  workflowId: string;
  n8ns: WorkflowN8nsProps;
}) => {
  return (
    <>
      <QuickSearchAdd
        title="Connect N8n"
        content={<CreateN8nArchivedWorkflowForm id={workflowId} />}
      />
      <Title order={2} size="h3" fw={700}>
        n8n Archived Workflows
      </Title>
      <MantineTable
        records={n8ns}
        columns={[
          {
            accessor: "workflowId",
            title: "N8n Id",
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
            accessor: "actions",
            title: "Aktionen",
            width: "0%",
            render: (n8n) => (
              <Group gap={0} justify="flex-end" wrap="nowrap">
                {/* <ViewActionIcon href={`/runs/${run.id}`} /> */}
                <ActionIcon
                  onClick={() => {
                    modals.open({
                      title: `Disconnect n8n`,
                      children: (
                        <>
                          <ButtonAction
                            hideModals
                            color="red"
                            fullWidth
                            action={deleteN8nArchivedWorkflow}
                            values={{
                              n8nWorkflow: { name: n8n.name, id: n8n.id },
                              id: workflowId,
                            }}
                          >
                            Disconnect
                          </ButtonAction>
                        </>
                      ),
                    });
                  }}
                  variant="subtle"
                  color="red"
                >
                  <IconTrash
                    style={{ width: "70%", height: "70%" }}
                    stroke={1.5}
                  />
                </ActionIcon>
              </Group>
            ),
            ...tableColumnProps,
          },
        ]}
        storeKey="n8ns-archived-workflow-table"
      />
    </>
  );
};
