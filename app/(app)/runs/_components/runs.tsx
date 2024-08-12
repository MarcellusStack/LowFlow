"use server";
import React from "react";
import { getRuns } from "../_actions";
import { RunsTable } from "./runs-table";

export const Runs = async ({
  searchParams,
}: {
  searchParams: Record<string, any> | null | undefined;
}) => {
  const runs = (await getRuns(searchParams)) ?? [];

  return (
    <>
      <RunsTable runs={runs} />
    </>
  );
};
