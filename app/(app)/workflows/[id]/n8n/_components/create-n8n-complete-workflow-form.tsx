"use client";
import React from "react";
import { useForm } from "@mantine/form";
import { Button, Stack } from "@mantine/core";
import { zodResolver } from "mantine-form-zod-resolver";
import { useEnhancedAction } from "@hooks/use-enhanced-action";
import { createN8nCompleteWorkflow } from "../_actions";
import { EntitySelect } from "@components/entity-select";
import { getN8nsAction } from "@server/_actions";
import { processN8nSchema } from "../_schemas";

export const CreateN8nCompleteWorkflowForm = ({ id }: { id: string }) => {
  const form = useForm({
    name: "create-n8n-complete-workflow-form",
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
    action: createN8nCompleteWorkflow,
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
          formActionName="create-n8n-complete-workflow-form"
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
