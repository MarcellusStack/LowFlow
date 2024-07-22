import { Divider, Group, Stack, Title, Text } from "@mantine/core";
import { IconSlash } from "@tabler/icons-react";
import React from "react";

export type SecondaryHeadingProps = {
  title: string;
  subtitle: string | null;
};

export const SecondaryHeading = ({
  title,
  subtitle,
}: SecondaryHeadingProps) => {
  return (
    <>
      <Stack gap="0">
        <Title order={1} size="h2" fw={700}>
          {title}
        </Title>
        <Text size="lg" c="dimmed">
          {subtitle}
        </Text>
      </Stack>
    </>
  );
};
