"use client";
import { Group } from "@mantine/core";
import { MantineTable } from "@components/mantine-table";
import { tableColumnProps } from "@constants/index";
import { deleteN8n, N8nsProps } from "../_actions";
import { DeleteActionIcon } from "@components/delete-action-icon";

export const N8nsTable = ({ n8ns }: { n8ns: N8nsProps }) => {
  return (
    <MantineTable
      records={n8ns || []}
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
              <DeleteActionIcon id={n8n.id} action={deleteN8n} entity="N8n" />
            </Group>
          ),
          ...tableColumnProps,
        },
      ]}
      storeKey="n8ns-table"
    />
  );
};
