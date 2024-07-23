"use client";
import React from "react";
import { useForm } from "@mantine/form";
import { Button, Select, Stack, Textarea, TextInput } from "@mantine/core";
import { zodResolver } from "mantine-form-zod-resolver";
import { useEnhancedAction } from "@hooks/use-enhanced-action";
import {
  createWorkflowProcesses,
  updateWorkflowProcesses,
  WorkflowProcessesProps,
} from "../_actions";
import { presentationStatus } from "@constants/presentation-status";
import {
  updateWorkflowProcessesSchema,
  workflowProcessesSchema,
} from "../_schemas";

export const WorkflowProcessForm = ({
  workflowId,
  process,
}: {
  workflowId: string;
  process?: WorkflowProcessesProps[0];
}) => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: process
      ? {
          id: process.id,
          name: process.name,
          description: process.description,
          status: process.status,
          workflowId: process.workflowId,
        }
      : { name: "", description: "", status: "", workflowId: workflowId },
    validate: zodResolver(
      process ? updateWorkflowProcessesSchema : workflowProcessesSchema
    ),
  });
  const create = useEnhancedAction({
    action: createWorkflowProcesses,
    hideModals: true,
  });

  const update = useEnhancedAction({
    action: updateWorkflowProcesses,
    hideModals: true,
  });

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
