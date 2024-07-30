"use client";
import { Branding } from "@components/branding";
import { Breadcrumb } from "@components/breadcrumb";
import { UserButton } from "@components/user-button";
import { AppShell, Button, Flex, Loader, Stack } from "@mantine/core";
import {
  IconArrowBigRightLines,
  IconArrowsRandom,
  IconArrowsShuffle,
  IconLayoutDashboard,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";

export type NavLinkProps = {
  id: string;
  href: string;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
};

export const navLinks: NavLinkProps[] = [
  {
    id: "nav-GD5KD7GNBB",
    href: "/dashboard",
    icon: <IconLayoutDashboard stroke={1.5} />,
    label: "Dashboard",
  },
  {
    id: "nav-2TCR0AX9Z2",
    href: "/workflows",
    icon: <IconArrowsRandom stroke={1.5} />,
    label: "Workflows",
  },
  {
    id: "nav-9X5R2J5YX7",
    href: "/processes",
    icon: <IconArrowsShuffle stroke={1.5} />,
    label: "Processes",
  },
  {
    id: "nav-3X5R2J5YX7",
    href: "/runs",
    icon: <IconArrowBigRightLines stroke={1.5} />,
    label: "Runs",
  },
];

const NavLink = ({ link }: { link: NavLinkProps }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <Button
      color="black"
      justify="flex-start"
      variant="subtle"
      component={Link}
      href={link.href}
      onClick={() => startTransition(() => router.push(link.href))}
      disabled={link.disabled && link.disabled}
      leftSection={isPending ? <Loader size="xs" /> : link.icon}
    >
      {link.label}
    </Button>
  );
};

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: false } }}
      padding="sm"
    >
      <AppShell.Header px="sm">
        <Flex justify="space-between" align="center" className="w-full h-full">
          <Branding />
          <UserButton />
        </Flex>
      </AppShell.Header>
      <AppShell.Navbar p="sm">
        {navLinks.map((link) => (
          <NavLink link={link} key={link.id} />
        ))}
      </AppShell.Navbar>
      <AppShell.Main>
        <Stack gap="sm">
          <Breadcrumb />
          {children}
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
};
