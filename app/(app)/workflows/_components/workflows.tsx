"use server";
import React from "react";
import { getWorkflows } from "../_actions";
import { WorkflowsCards } from "./workflows-cards";

export const Workflows = async ({
  searchParams,
}: {
  searchParams: Record<string, any> | null | undefined;
}) => {
  const workflows = (await getWorkflows(searchParams)) ?? [];
  return <WorkflowsCards workflows={workflows} />;
};
