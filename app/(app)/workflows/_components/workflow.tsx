import { Badge, Flex, Paper, Text } from "@mantine/core";
import Link from "next/link";
import React from "react";
import { WorkflowProps } from "../_actions";
import styles from "../workflow.module.css";

export const Workflow = ({ props }: { props: WorkflowProps[0] }) => {
  const { id, name, description, status } = props;

  return (
    <Paper
      className={styles.card}
      withBorder
      p="sm"
      component={Link}
      href={`/workflows/${id}`}
    >
      <Flex justify="space-between">
        <Text fw={500}>{name}</Text>
        <Badge color="green">{status}</Badge>
      </Flex>
      <Text size="sm" c="dimmed">
        {description}
      </Text>
    </Paper>
  );
};
