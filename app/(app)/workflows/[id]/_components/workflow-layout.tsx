"use client";
import React from "react";
import { Stack } from "@mantine/core";
import { SecondaryPageTabs } from "@components/secondary-page-tabs";
import {
  IconAlertTriangle,
  IconArrowsShuffle,
  IconInfoSquare,
} from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { SecondaryHeading } from "@components/secondary-heading";
import { WorkflowProps } from "../_actions";

export const WorkflowLayout = ({
  workflow,
  children,
}: {
  workflow: WorkflowProps;
  children: React.ReactNode;
}) => {
  const searchParams = useSearchParams();

  return (
    <>
      <Stack gap="sm">
        <SecondaryHeading
          title={workflow.name}
          subtitle={workflow.description}
        />
        <SecondaryPageTabs
          page="workflows"
          links={[
            {
              value: `/`,
              icon: <IconInfoSquare size={16} stroke={1.5} />,
              label: "General",
            },
            {
              value: `processes`,
              icon: <IconArrowsShuffle size={16} stroke={1.5} />,
              label: "Processes",
            },
            {
              value: `danger`,
              icon: <IconAlertTriangle size={16} stroke={1.5} />,
              label: "Danger",
            },
          ]}
        />
        {children}
      </Stack>
    </>
  );
};
