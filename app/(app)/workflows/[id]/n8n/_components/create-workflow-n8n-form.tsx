"use client";
import React from "react";
import { useForm } from "@mantine/form";
import { Button, Stack } from "@mantine/core";
import { zodResolver } from "mantine-form-zod-resolver";
import { useEnhancedAction } from "@hooks/use-enhanced-action";
import { createWorkflowN8n } from "../_actions";
import { EntitySelect } from "@components/entity-select";
import { getN8nsAction } from "@server/_actions";
import { processN8nSchema } from "../_schemas";

export const CreateWorkflowN8nForm = ({ id }: { id: string }) => {
  const form = useForm({
    name: "create-workflow-n8n",
    mode: "uncontrolled",
    initialValues: {
      n8nWorkflow: {
        id: "",
        name: "",
      },
      id: id,
    },
    validate: zodResolver(processN8nSchema),
  });
  const { isPending, execute } = useEnhancedAction({
    action: createWorkflowN8n,
    hideModals: true,
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        execute(values);
      })}
    >
      <Stack gap="sm">
        <EntitySelect
          formActionName="create-workflow-n8n"
          formField="n8nWorkflow"
          label="N8n Workflow"
          action={getN8nsAction}
          dataKey="n8ns"
          displayKey="name"
        />
        <Button color="black" type="submit" loading={isPending}>
          Submit
        </Button>
      </Stack>
    </form>
  );
};
