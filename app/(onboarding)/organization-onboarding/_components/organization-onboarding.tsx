"use client";
import { Button, Paper, Stack, TextInput, Title } from "@mantine/core";
import React from "react";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { createOrganizationSchema } from "../_schemas";
import { useEnhancedAction } from "../../../../hooks/use-enhanced-action";
import { createOrganization } from "../_actions";

export const OrganizationOnboarding = () => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
    },
    validate: zodResolver(createOrganizationSchema),
  });
  const { isPending, execute } = useEnhancedAction({
    action: createOrganization,
    redirectUrl: "/dashboard",
  });
  return (
    <Paper radius="sm" withBorder p="sm">
      <Stack gap="sm">
        <Title order={2}>Organization Onboarding</Title>
        <form
          onSubmit={form.onSubmit((values) => {
            execute(values);
          })}
        >
          <Stack gap="sm">
            <TextInput
              withAsterisk
              label="Name"
              key={form.key("name")}
              {...form.getInputProps("name")}
            />
            <Button color="black" type="submit" loading={isPending}>
              Submit
            </Button>
          </Stack>
        </form>
      </Stack>
    </Paper>
  );
};
