"use client";
import { ActionIcon, Group } from "@mantine/core";
import { MantineTable } from "@components/mantine-table";
import { tableColumnProps } from "@constants/index";
import { deleteProcessN8n, ProcessN8nsProps } from "../_actions";
import { DeleteActionIcon } from "@components/delete-action-icon";
import { modals } from "@mantine/modals";
import { ButtonAction } from "@components/button-action";
import { IconTrash } from "@tabler/icons-react";

export const ProcessN8nsTable = ({
  processId,
  n8ns,
}: {
  processId: string;
  n8ns: ProcessN8nsProps;
}) => {
  return (
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
                          action={deleteProcessN8n}
                          values={{
                            n8nWorkflow: { name: n8n.name, id: n8n.id },
                            id: processId,
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
      storeKey="n8ns-process-table"
    />
  );
};
