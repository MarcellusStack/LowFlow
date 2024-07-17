"use client";

import { ActionIcon, Avatar, Loader, Menu } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import React from "react";
import { signOutAction } from "@server/_actions";
import { useEnhancedAction } from "@hooks/use-enhanced-action";

export const UserButton = () => {
  const session = useSession();

  const { isPending, execute } = useEnhancedAction({
    action: signOutAction,
    notification: false,
    onFinish() {
      window.location.reload();
    },
  });

  if (session.status === "loading") {
    return <Loader />;
  }
  if (!session.data) {
    return null;
  }
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon color="gray" size="xl" variant="subtle" radius="xl">
          <Avatar radius="xl" color="black" />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>{session.data?.user?.email}</Menu.Label>
        <Menu.Item
          onClick={() => {
            execute({});
          }}
          leftSection={
            isPending ? (
              <Loader size="xs" />
            ) : (
              <IconLogout style={{ width: "70%", height: "70%" }} />
            )
          }
        >
          Sign Out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
