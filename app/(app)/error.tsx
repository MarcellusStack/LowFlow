"use client";

import { Card, Stack, ThemeIcon, Text, Button, Group } from "@mantine/core";
import { IconExclamationCircle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isBackTransitionPending, startBackTransition] = useTransition();
  const [isReloadTransitionPending, startReloadTransition] = useTransition();
  const router = useRouter();

  const back = () => {
    startBackTransition(() => router.back());
  };

  const reload = () => {
    startReloadTransition(() => {
      router.refresh();
      reset();
    });
  };

  return (
    <Stack
      gap="sm"
      align="center"
      justify="center"
      top="50%"
      left="50%"
      pos="absolute"
      className="-translate-x-1/2 -translate-y-1/2 min-w-[300px]"
    >
      <Card withBorder>
        <Stack gap="sm" align="center" justify="center">
          <ThemeIcon size="xl" color="red" variant="light">
            <IconExclamationCircle style={{ width: "70%", height: "70%" }} />
          </ThemeIcon>
          <Text fw={700} size="lg" ta="center">
            Sie haben keinen Zugriff auf diese Seite oder es ist ein Fehler
            aufgetreten!
          </Text>
          <Text fw={500} size="md" ta="center" c="red">
            {error.message}
          </Text>
          <Group gap="sm">
            <Button
              loading={isBackTransitionPending}
              onClick={back}
              variant="light"
            >
              Zurück
            </Button>
            <Button
              loading={isReloadTransitionPending}
              variant="filled"
              color="black"
              onClick={reload}
            >
              Erneut versuchen
            </Button>
          </Group>
        </Stack>
      </Card>
    </Stack>
  );
}
