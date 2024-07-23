import { PresentationStatus as PrismaPresentationStatus } from "@prisma/client";

export const presentationStatus = [
  {
    value: PrismaPresentationStatus.public,
    label: "Public",
    color: "green",
  },
  { value: PrismaPresentationStatus.draft, label: "Draft", color: "yellow" },
  {
    value: PrismaPresentationStatus.archived,
    label: "Archived",
    color: "gray",
  },
] as const;

export type PresentationStatus = (typeof presentationStatus)[number];
export type StatusValue = PresentationStatus["value"];
