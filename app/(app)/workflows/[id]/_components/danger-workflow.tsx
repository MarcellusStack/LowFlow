"use client";
import React from "react";
import { deleteWorkflow } from "../_actions";
import { Fieldset } from "@components/fieldset";
import { ButtonModal } from "@components/button-modal";
import { ButtonAction } from "@components/button-action";

export const DangerWorkflow = ({ id }: { id: string }) => {
  return (
    <Fieldset
      spoiler={false}
      c="red"
      style={{
        borderColor: "var(--mantine-color-red-2)",
      }}
      legend="Danger"
    >
      <ButtonModal
        color="red"
        content={
          <ButtonAction
            redirectUrl="/workflows"
            hideModals={true}
            color="red"
            action={deleteWorkflow}
            values={{ id: id }}
          >
            Delete
          </ButtonAction>
        }
      >
        Delete Workflow
      </ButtonModal>
    </Fieldset>
  );
};
