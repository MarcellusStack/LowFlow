import { ActionIcon } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconTrash } from "@tabler/icons-react";
import React from "react";
import { ButtonAction } from "./button-action";

export type DeleteActionProps = {
  id: string;
  entity: string;
  action: unknown;
};

export const DeleteActionIcon = ({ id, entity, action }: DeleteActionProps) => {
  return (
    <ActionIcon
      onClick={() => {
        modals.open({
          title: `Delete ${entity}`,
          children: (
            <>
              <ButtonAction
                color="red"
                fullWidth
                action={action}
                values={{ id }}
              >
                Delete
              </ButtonAction>
            </>
          ),
        });
      }}
      variant="subtle"
      color="red"
    >
      <IconTrash style={{ width: "70%", height: "70%" }} stroke={1.5} />
    </ActionIcon>
  );
};
