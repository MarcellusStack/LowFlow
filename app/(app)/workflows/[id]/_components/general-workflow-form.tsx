"use client";
import React from "react";
import { useForm } from "@mantine/form";
import {
  Button,
  Grid,
  Group,
  Select,
  Spoiler,
  Stack,
  Textarea,
  TextInput,
  Text,
} from "@mantine/core";
import { zodResolver } from "mantine-form-zod-resolver";
import { useEnhancedAction } from "@hooks/use-enhanced-action";
import { updateWorkflow, WorkflowProps } from "../_actions";
import { updateWorkflowSchema } from "../_schemas";
import { Fieldset } from "@components/fieldset";
import { presentationStatus } from "@constants/presentation-status";

export const GeneralWorkflowForm = ({
  workflow,
}: {
  workflow: WorkflowProps;
}) => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      id: workflow.id,
      name: workflow.name,
      description: workflow.description,
      status: workflow.status,
    },
    validate: zodResolver(updateWorkflowSchema),
  });
  const { isPending, execute } = useEnhancedAction({
    action: updateWorkflow,
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        execute(values);
      })}
    >
      <Fieldset legend="General">
        <Grid gutter="sm" grow>
          <Grid.Col span={{ base: 12, sm: 12, md: 6, xl: 4 }}>
            <TextInput
              withAsterisk
              label="Name"
              key={form.key("name")}
              {...form.getInputProps("name")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 12, md: 6, xl: 4 }}>
            <Textarea
              label="Description"
              key={form.key("description")}
              {...form.getInputProps("description")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 12, md: 6, xl: 4 }}>
            <Select
              label="Status"
              key={form.key("status")}
              data={presentationStatus}
              {...form.getInputProps("status")}
            />
          </Grid.Col>
        </Grid>
        <Button my="sm" color="black" type="submit" loading={isPending}>
          Save
        </Button>
      </Fieldset>
    </form>
  );
};
