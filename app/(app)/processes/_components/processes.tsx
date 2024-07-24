"use server";
import React from "react";
import { ProcessesTable } from "./processes-table";
import { getProcesses } from "../_actions";

export const Processes = async ({
  searchParams,
}: {
  searchParams: Record<string, any> | null | undefined;
}) => {
  const processes = (await getProcesses(searchParams)) ?? [];

  return <ProcessesTable processes={processes} />;
};
