"use client";
import { ActionIcon, Group, Title } from "@mantine/core";
import { MantineTable } from "@components/mantine-table";
import { tableColumnProps } from "@constants/index";

import { modals } from "@mantine/modals";
import { ButtonAction } from "@components/button-action";
import { IconTrash } from "@tabler/icons-react";
import { QuickSearchAdd } from "@components/quick-search-add";
import { ConnectN8nWorkflowForm } from "./connect-n8n-workflow-form";
import { ProcessN8nsProps } from "../app/(app)/processes/[id]/n8n/_actions";

export const N8nWorkflows = ({
  id,
  title,
  n8ns,
  createAction,
  deleteAction,
}: {
  id: string;
  title: "Complete" | "Ongoing" | "Reset" | "Archive";
  n8ns: ProcessN8nsProps;
  createAction: any;
  deleteAction: any;
}) => {
  return (
    <>
      <QuickSearchAdd
        title="Connect N8n"
        content={<ConnectN8nWorkflowForm id={id} action={createAction} />}
      />
      <Title order={2} size="h3" fw={700}>
        n8n {title} Workflows
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
                            action={deleteAction}
                            values={{
                              n8nWorkflow: { name: n8n.name, id: n8n.id },
                              id: id,
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
        storeKey={`n8ns-workflows-table-${id}`}
      />
    </>
  );
};
