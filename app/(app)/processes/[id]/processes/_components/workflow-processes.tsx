"use server";
import React from "react";
import { WorkflowProcessesTable } from "./workflow-processes-table";
import { getWorkflowProcesses } from "../_actions";

export const WorkflowProcesses = async ({
  searchParams,
}: {
  searchParams: Record<string, any> | null | undefined;
}) => {
  const processes = (await getWorkflowProcesses(searchParams)) ?? [];

  return <WorkflowProcessesTable processes={processes} />;
};
