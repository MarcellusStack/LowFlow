"use client";
import React from "react";
import { useForm } from "@mantine/form";
import { Button, Stack, Textarea, TextInput } from "@mantine/core";
import { zodResolver } from "mantine-form-zod-resolver";
import { useEnhancedAction } from "@hooks/use-enhanced-action";
import { createWorkflowSchema } from "../_schemas";
import { createWorkflow } from "../_actions";

export const CreateWorkflowForm = () => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      description: "",
    },
    validate: zodResolver(createWorkflowSchema),
  });
  const { isPending, execute } = useEnhancedAction({
    action: createWorkflow,
    hideModals: true,
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        execute(values);
      })}
    >
      <Stack gap="md">
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
        <Button color="black" type="submit" loading={isPending}>
          Submit
        </Button>
      </Stack>
    </form>
  );
};
