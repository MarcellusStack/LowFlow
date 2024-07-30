import { ProcessStatus as PrismaProcessStatus } from "@prisma/client";

export const processStatus = [
  {
    value: PrismaProcessStatus.open,
    label: "Open",
    color: "black",
  },
  { value: PrismaProcessStatus.ongoing, label: "Ongoing", color: "yellow" },
  {
    value: PrismaProcessStatus.completed,
    label: "Completed",
    color: "green",
  },
  {
    value: PrismaProcessStatus.archived,
    label: "Archived",
    color: "gray",
  },
  {
    value: PrismaProcessStatus.incomplete,
    label: "Incomplete",
    color: "red",
  },
] as const;

export type ProcessStatus = (typeof processStatus)[number];
export type ProcessValue = ProcessStatus["value"];
