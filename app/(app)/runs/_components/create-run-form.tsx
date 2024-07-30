"use client";
import React from "react";
import { useForm } from "@mantine/form";
import { Button, Stack, Textarea, TextInput } from "@mantine/core";
import { zodResolver } from "mantine-form-zod-resolver";
import { useEnhancedAction } from "@hooks/use-enhanced-action";
import { createRunSchema } from "../_schemas";
import { createRun } from "../_actions";
import { EntitySelect } from "@components/entity-select";
import { getWorkflowsAction } from "../../processes/_actions";

export const CreateRunForm = () => {
  const form = useForm({
    name: "create-run",
    mode: "uncontrolled",
    initialValues: {
      workflow: "",
    },
    validate: zodResolver(createRunSchema),
  });
  const { isPending, execute } = useEnhancedAction({
    action: createRun,
    hideModals: true,
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        execute(values);
      })}
    >
      <Stack gap="md">
        <EntitySelect
          formActionName="create-run"
          formField="workflow"
          label="Workflow"
          action={getWorkflowsAction}
          dataKey="workflows"
          displayKey="name"
        />
        <Button color="black" type="submit" loading={isPending}>
          Submit
        </Button>
      </Stack>
    </form>
  );
};
