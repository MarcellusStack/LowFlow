import { ActionIcon } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconPencil } from "@tabler/icons-react";
import React from "react";

export type UpdateModalActionProps = {
  entity: string;
  content: unknown;
};

export const UpdateModalActionIcon = ({
  entity,
  content,
}: UpdateModalActionProps) => {
  return (
    <ActionIcon
      onClick={() => {
        modals.open({
          title: `${entity} aktualisieren`,
          children: <>{content}</>,
        });
      }}
      variant="subtle"
      color="yellow"
    >
      <IconPencil style={{ width: "70%", height: "70%" }} stroke={1.5} />
    </ActionIcon>
  );
};
