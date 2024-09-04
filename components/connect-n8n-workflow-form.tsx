"use client";
import React from "react";
import { useForm } from "@mantine/form";
import { Button, Stack } from "@mantine/core";
import { zodResolver } from "mantine-form-zod-resolver";
import { useEnhancedAction } from "@hooks/use-enhanced-action";
import { EntitySelect } from "@components/entity-select";
import { getN8nsAction } from "@server/_actions";
import { processN8nSchema } from "@schemas/index";



export const ConnectN8nWorkflowForm = ({
  id,
  action,
}: {
  id: string;
  action: any;
}) => {
  const form = useForm({
    name: "connect-n8n-workflow-form",
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
    action: action,
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
          formActionName="connect-n8n-workflow-form"
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
