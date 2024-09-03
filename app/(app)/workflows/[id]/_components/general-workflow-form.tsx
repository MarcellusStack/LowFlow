"use client";
import React from "react";
import { useForm } from "@mantine/form";
import {
  Button,
  Checkbox,
  Grid,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { zodResolver } from "mantine-form-zod-resolver";
import { useEnhancedAction } from "@hooks/use-enhanced-action";
import { updateWorkflow, WorkflowProps } from "../_actions";
import { updateWorkflowSchema } from "../_schemas";
import { Fieldset } from "@components/fieldset";
import { presentationStatus } from "@constants/presentation-status";
import { GridColumn } from "@components/grid-column";

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
      approval: workflow.approval,
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
          <GridColumn column={4}>
            <TextInput
              withAsterisk
              label="Name"
              key={form.key("name")}
              {...form.getInputProps("name")}
            />
          </GridColumn>
          <GridColumn column={4}>
            <Textarea
              label="Description"
              key={form.key("description")}
              {...form.getInputProps("description")}
            />
          </GridColumn>
          <GridColumn column={4}>
            <Select
              label="Status"
              key={form.key("status")}
              data={presentationStatus}
              {...form.getInputProps("status")}
            />
          </GridColumn>
          <GridColumn column={4}>
            <Checkbox
              label="Approval"
              key={form.key("approval")}
              {...form.getInputProps("approval", { type: "checkbox" })}
            />
          </GridColumn>
        </Grid>
        <Button my="sm" color="black" type="submit" loading={isPending}>
          Save
        </Button>
      </Fieldset>
    </form>
  );
};
