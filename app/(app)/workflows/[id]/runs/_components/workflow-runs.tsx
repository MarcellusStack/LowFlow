"use server";
import React from "react";
import { WorkflowRunsTable } from "./workflow-runs-table";
import { getWorkflowRuns } from "../_actions";

export const WorkflowRuns = async ({
  searchParams,
}: {
  searchParams: Record<string, any> | null | undefined;
}) => {
  const runs = (await getWorkflowRuns(searchParams)) ?? [];

  return <WorkflowRunsTable runs={runs} />;
};
