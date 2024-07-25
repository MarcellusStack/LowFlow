"use client";
import React from "react";
import { useForm } from "@mantine/form";
import { Button, Grid, Select, Textarea, TextInput } from "@mantine/core";
import { zodResolver } from "mantine-form-zod-resolver";
import { useEnhancedAction } from "@hooks/use-enhanced-action";
import { Fieldset } from "@components/fieldset";
import { presentationStatus } from "@constants/presentation-status";
import { GridColumn } from "@components/grid-column";
import { ProcessProps, updateProcess } from "../_actions";
import { WorkflowSelect } from "../../_components/workflow-select";
import { updateProcessSchema } from "../../_schemas";

export const GeneralProcessForm = ({ process }: { process: ProcessProps }) => {
  const form = useForm({
    name: "general-process-form",
    mode: "uncontrolled",
    initialValues: {
      id: process.id,
      name: process.name,
      description: process.description,
      status: process.status,
      workflow: process.workflow,
    },
    validate: zodResolver(updateProcessSchema),
  });
  const { isPending, execute } = useEnhancedAction({
    action: updateProcess,
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
            <WorkflowSelect
              initialValue={process ? process.workflow : ""}
              formActionName="general-process-form"
              formField="workflow"
              label="Workflow"
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
