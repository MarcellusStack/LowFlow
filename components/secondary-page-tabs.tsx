"use client";

import { Divider, Flex, Loader, ScrollArea, Tabs } from "@mantine/core";
import React, { useTransition } from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useState } from "react";

export type SecondaryPageTabsProps = {
  page: string;
  links: {
    value: string;
    icon: React.ReactNode;
    label: string;
    disabled?: boolean;
  }[];
};

export const SecondaryPageTabs = ({ page, links }: SecondaryPageTabsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { id } = useParams();
  const [isPending, startTransition] = useTransition();
  const [loadingTab, setLoadingTab] = useState<string | null>(null);

  return (
    <Tabs
      value={pathname.split("/")[3] ?? "/"}
      onChange={(value) => {
        setLoadingTab(value);
        startTransition(() => {
          const currentSearchParams = new URLSearchParams(
            searchParams.toString()
          );
          const newUrl = `/${page}/${id}/${value}?${currentSearchParams.toString()}`;
          router.push(newUrl);
        });
      }}
    >
      <Tabs.List>
        <ScrollArea w="100%">
          <Flex direction="row" gap="xs">
            {links.map((link) => (
              <Tabs.Tab
                disabled={link.disabled && link.disabled}
                key={link.value}
                value={link.value.split("?")[0]} // Use the base path as the value
                leftSection={
                  isPending && loadingTab === link.value ? (
                    <Loader color="black" size="xs" />
                  ) : (
                    link.icon
                  )
                }
              >
                {link.label}
              </Tabs.Tab>
            ))}
          </Flex>
        </ScrollArea>
      </Tabs.List>
    </Tabs>
  );
};
