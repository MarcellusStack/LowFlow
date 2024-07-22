"use client";
import React from "react";
import { useForm } from "@mantine/form";
import { Button } from "@mantine/core";
import { zodResolver } from "mantine-form-zod-resolver";
import { useEnhancedAction } from "@hooks/use-enhanced-action";
import { deleteWorkflow } from "../_actions";
import { Fieldset } from "@components/fieldset";
import { deleteSchema } from "@schemas/index";

export const DeleteWorkflowForm = ({ id }: { id: string }) => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      id: id,
    },
    validate: zodResolver(deleteSchema),
  });
  const { isPending, execute } = useEnhancedAction({
    action: deleteWorkflow,
    notification: false,
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        execute(values);
      })}
    >
      <Fieldset
        spoiler={false}
        style={{
          borderColor: "var(--mantine-color-red-2)",
        }}
        legend="Danger"
      >
        <Button color="red" type="submit" loading={isPending}>
          Delete
        </Button>
      </Fieldset>
    </form>
  );
};
