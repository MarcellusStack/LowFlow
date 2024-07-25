"use client";
import React from "react";
import { deleteProcess } from "../../_actions";
import { Fieldset } from "@components/fieldset";
import { ButtonModal } from "@components/button-modal";
import { ButtonAction } from "@components/button-action";

export const DangerProcess = ({ id }: { id: string }) => {
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
            color="red"
            action={deleteProcess}
            hideModals={true}
            redirectUrl="/processes"
            values={{ id: id }}
          >
            Delete
          </ButtonAction>
        }
      >
        Delete Process
      </ButtonModal>
    </Fieldset>
  );
};
