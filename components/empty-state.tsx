import { Paper, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconDatabaseOff } from "@tabler/icons-react";
import React from "react";

export const EmptyState = () => {
  return (
    <Paper p="sm" withBorder>
      <Stack gap="0" align="center">
        <ThemeIcon size="lg" radius="xl" variant="light" color="gray">
          <IconDatabaseOff style={{ width: "70%", height: "70%" }} />
        </ThemeIcon>
        <Text c="dimmed">No records found</Text>
      </Stack>
    </Paper>
  );
};
