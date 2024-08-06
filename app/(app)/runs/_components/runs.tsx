"use server";
import React from "react";
import { getRuns } from "../_actions";
import { RunsTable } from "./runs-table";
import { RunDataTable } from "./run-data-table";
import { TestDataTable } from "./run-data-table";

export const Runs = async ({
  searchParams,
}: {
  searchParams: Record<string, any> | null | undefined;
}) => {
  const runs = (await getRuns(searchParams)) ?? [];
  console.log(runs);

  return (
    <>
      <RunsTable runs={runs} />
    </>
  );
};
