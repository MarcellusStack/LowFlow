"use client";
import React from "react";
import { useForm } from "@mantine/form";
import { Button, Divider, Stack, Textarea, Text, Anchor } from "@mantine/core";
import { zodResolver } from "mantine-form-zod-resolver";
import { useEnhancedAction } from "@hooks/use-enhanced-action";
import { createN8n, getN8nsAction } from "../_actions";
import { EntitySelect } from "@components/entity-select";
import { createN8nSchema } from "../_schemas";

export const CreateN8nForm = () => {
  const form = useForm({
    name: "create-n8n",
    mode: "uncontrolled",
    initialValues: {
      n8nWorkflow: {
        id: "",
        name: "",
      },
      description: "",
    },
    validate: zodResolver(createN8nSchema),
  });
  const { isPending, execute } = useEnhancedAction({
    action: createN8n,
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
          formActionName="create-n8n"
          formField="n8nWorkflow"
          label="N8n Workflow"
          action={getN8nsAction}
          dataKey="n8ns"
          displayKey="name"
        />
        <Textarea label="Description" {...form.getInputProps("description")} />
        <Button color="black" type="submit" loading={isPending}>
          Submit
        </Button>
        <Divider />
        <Anchor
          c="black"
          href={process.env.NEXT_PUBLIC_N8N_URL}
          target="_blank"
        >
          Create more n8n workflows
        </Anchor>
      </Stack>
    </form>
  );
};
