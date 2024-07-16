"use client";
import { Button, Paper, Stack, TextInput, Title } from "@mantine/core";
import React from "react";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { userOnboardingSchema } from "../_schemas";
import { useEnhancedAction } from "../../../../hooks/use-enhanced-action";
import { updateUserOnboarding } from "../_actions";

export const UserOnboarding = () => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      firstName: "",
      lastName: "",
    },
    validate: zodResolver(userOnboardingSchema),
  });
  const { isPending, execute } = useEnhancedAction({
    action: updateUserOnboarding,
    redirectUrl: "/dashboard",
  });
  return (
    <Paper radius="sm" withBorder p="sm">
      <Stack gap="sm">
        <Title order={2}>Benutzer Onboarding</Title>
        <form
          onSubmit={form.onSubmit((values) => {
            execute(values);
          })}
        >
          <Stack gap="sm">
            <TextInput
              withAsterisk
              label="First Name"
              key={form.key("firstName")}
              {...form.getInputProps("firstName")}
            />
            <TextInput
              withAsterisk
              label="Last Name"
              key={form.key("lastName")}
              {...form.getInputProps("lastName")}
            />
            <Button color="black" type="submit" loading={isPending}>
              Bestätigen
            </Button>
          </Stack>
        </form>
      </Stack>
    </Paper>
  );
};
