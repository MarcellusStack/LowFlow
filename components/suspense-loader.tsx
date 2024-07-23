"use client";
import { Flex, Loader, Text } from "@mantine/core";
import React from "react";

export const SuspenseLoader = ({ entity }: { entity: string }) => {
  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      style={{ height: 300 }}
      gap="xs"
    >
      <Text size="sm" c="dimmed">
        Loading {entity}
      </Text>
      <Loader color="black" />
    </Flex>
  );
};
