"use client";
import React from "react";
import { Stack } from "@mantine/core";
import { SecondaryPageTabs } from "@components/secondary-page-tabs";
import { SecondaryHeading } from "@components/secondary-heading";

export type SubLayout = {
  title: string;
  subtitle?: string;
  page: string;
  links: {
    value: string;
    icon: React.ReactNode;
    label: string;
    disabled?: boolean;
  }[];
  children: React.ReactNode;
};

export const SubLayout = ({
  title,
  subtitle,
  page,
  links,
  children,
}: SubLayout) => {
  return (
    <>
      <Stack gap="sm">
        <SecondaryHeading title={title} subtitle={subtitle} />
        <SecondaryPageTabs page={page} links={links} />
        {children}
      </Stack>
    </>
  );
};
