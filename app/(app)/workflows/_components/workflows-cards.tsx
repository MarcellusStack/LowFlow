"use client";
import { Grid } from "@mantine/core";
import React from "react";
import { Workflow } from "./workflow";
import { WorkflowProps } from "../_actions";
import { EmptyState } from "@components/empty-state";

export const WorkflowsCards = ({ workflows }: { workflows: WorkflowProps }) => {
  if (workflows.length === 0) {
    return <EmptyState />;
  }

  return (
    <Grid gutter="sm" flex={1}>
      {workflows.map((workflow) => (
        <Grid.Col
          key={workflow.id}
          span={{ base: 12, xs: 6, sm: 6, md: 4, lg: 4, xl: 3 }}
        >
          <Workflow props={workflow} />
        </Grid.Col>
      ))}
    </Grid>
  );
};
