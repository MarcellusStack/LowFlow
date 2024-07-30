"use client";
import React from "react";
import { useForm } from "@mantine/form";
import { Button, Stack } from "@mantine/core";
import { zodResolver } from "mantine-form-zod-resolver";
import { useEnhancedAction } from "@hooks/use-enhanced-action";
import { createWorkflowRun } from "../_actions";
import { workflowRunSchema } from "../_schemas";

export const WorkflowRunForm = ({ workflowId }: { workflowId: string }) => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      workflowId: workflowId,
    },
    validate: zodResolver(workflowRunSchema),
  });
  const create = useEnhancedAction({
    action: createWorkflowRun,
    hideModals: true,
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        create.execute(values);
      })}
    >
      <Stack gap="sm">
        <Button color="black" type="submit" loading={create.isPending}>
          Create
        </Button>
      </Stack>
    </form>
  );
};
