"use client";
import React, { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs, Anchor, ActionIcon, Loader } from "@mantine/core";
import { capitalizeFirstLetter } from "@utils/capitalize-first-letter";
import { IconChevronRight, IconLayoutDashboard } from "@tabler/icons-react";

export type BreadcrumbLinkProps = {
  item: string;
  index: number;
  slug: string[];
};

export const BreadcrumbLink = ({ item, index, slug }: BreadcrumbLinkProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <Anchor
      component={Link}
      className="no-underline"
      href={index === 0 ? `/${item}` : `/${slug.slice(0, index + 1).join("/")}`}
      onClick={() =>
        startTransition(() =>
          router.push(
            index === 0 ? `/${item}` : `/${slug.slice(0, index + 1).join("/")}`
          )
        )
      }
      c={index === slug.length - 1 ? "black" : "gray"}
      fw={500}
    >
      {isPending && <Loader size="xs" color="blue" mr="xs" />}
      {capitalizeFirstLetter(item)}
    </Anchor>
  );
};

export const Breadcrumb = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  const slug = pathname.split("/").slice(1);

  if (!slug) return null;

  return (
    <Breadcrumbs separator={<IconChevronRight size={16} />}>
      <Anchor
        component={Link}
        href="/dashboard"
        fw={500}
        onClick={() => startTransition(() => router.push("/dashboard"))}
      >
        <ActionIcon color="black" variant="subtle" loading={isPending}>
          <IconLayoutDashboard
            style={{ width: "70%", height: "70%" }}
            stroke={1.5}
          />
        </ActionIcon>
      </Anchor>

      {slug.map((item, index) => (
        <BreadcrumbLink key={item} item={item} index={index} slug={slug} />
      ))}
    </Breadcrumbs>
  );
};
