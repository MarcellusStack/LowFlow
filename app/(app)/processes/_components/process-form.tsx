"use client";
import React from "react";
import { useForm } from "@mantine/form";
import { Button, Select, Stack, Textarea, TextInput } from "@mantine/core";
import { zodResolver } from "mantine-form-zod-resolver";
import { useEnhancedAction } from "@hooks/use-enhanced-action";

import { presentationStatus } from "@constants/presentation-status";
import { processSchema, updateProcessSchema } from "../_schemas";
import { WorkflowSelect } from "./workflow-select";
import { createProcess, ProcessesProps, updateProcess } from "../_actions";

export const ProcessForm = ({ process }: { process?: ProcessesProps[0] }) => {
  const form = useForm({
    name: "process-form",
    mode: "uncontrolled",
    initialValues: process
      ? {
          id: process.id,
          name: process.name,
          description: process.description,
          status: process.status,
          workflow: process.workflow,
        }
      : { name: "", description: "", status: "", workflow: "" },
    validate: zodResolver(process ? updateProcessSchema : processSchema),
  });
  const create = useEnhancedAction({
    action: createProcess,
    hideModals: true,
  });

  const update = useEnhancedAction({
    action: updateProcess,
    hideModals: true,
  });

  console.log(form.errors);

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        if (process) {
          update.execute(values);
          return;
        }
        create.execute(values);
      })}
    >
      <Stack gap="sm">
        <TextInput
          withAsterisk
          label="Name"
          key={form.key("name")}
          {...form.getInputProps("name")}
        />
        <Textarea
          label="Description"
          key={form.key("description")}
          {...form.getInputProps("description")}
        />
        <Select
          label="Status"
          key={form.key("status")}
          data={presentationStatus}
          {...form.getInputProps("status")}
        />
        <WorkflowSelect
          initialValue={process ? process.workflow : ""}
          formActionName="process-form"
          formField="workflow"
          label="Workflow"
        />
        <Button
          color="black"
          type="submit"
          loading={process ? update.isPending : create.isPending}
        >
          {process ? "Update" : "Create"}
        </Button>
      </Stack>
    </form>
  );
};
