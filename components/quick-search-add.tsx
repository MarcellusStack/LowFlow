"use client";

import { useDebouncedValue } from "@mantine/hooks";
import { Button, TextInput, Group, ActionIcon } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import React, { ReactNode, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { modals } from "@mantine/modals";
import { usePathname } from "next/navigation";

export type QuickSearchAddProps = {
  title: string;
  content: ReactNode;
};

export const QuickSearchAdd = ({
  title,
  content,
}: QuickSearchAddProps) => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search");

  const [text, setText] = useState(search ? search : "");
  const [query] = useDebouncedValue(text, 750);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (!query) {
      newSearchParams.delete("search");
    } else {
      newSearchParams.set("search", query);
    }
    router.push(`${pathName}?${newSearchParams.toString()}`);
  }, [query]);
  return (
    <>
      <Group gap="sm" wrap="nowrap">
        <TextInput
          value={text}
          onChange={(event) => setText(event.currentTarget.value)}
          placeholder="Suche"
          className="w-full"
        />
        <Button
          color="black"
          visibleFrom="sm"
          className="shrink-0"
          leftSection={<IconPlus size={14} />}
          onClick={() => {
            modals.open({
              title: title,
              children: <>{content}</>,
            });
          }}
        >
          Create
        </Button>
        <ActionIcon
          color="black"
          hiddenFrom="sm"
          size="lg"
          onClick={() => {
            modals.open({
              title: title,
              children: <>{content}</>,
            });
          }}
          aria-label="Add"
        >
          <IconPlus style={{ width: "70%", height: "70%" }} stroke={1.5} />
        </ActionIcon>
      </Group>
    </>
  );
};
