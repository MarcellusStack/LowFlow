"use client";
import {
  ActionIcon,
  Button,
  Divider,
  Flex,
  Indicator,
  rem,
  Stack,
  Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { ProcessStatus } from "@prisma/client";
import {
  IconCircle,
  IconCircleCheck,
  IconCircleDashed,
  IconCircleOff,
  IconCircleX,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export type ProcessProps = {
  process: ProcessStatus;
  title: string;
  description: string;
  href: string;
  id: string;
};

const handleProcessColor = (process: ProcessStatus) => {
  switch (process) {
    case "open":
      return "black";
    case "ongoing":
      return "yellow";
    case "completed":
      return "green";
    case "incomplete":
      return "red";
    case "archived":
      return "gray";
    default:
      return "gray";
  }
};

export const Process = ({
  process,
  title,
  description,
  href,
  id,
}: ProcessProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Flex gap="sm" wrap="nowrap">
      <Stack gap="xs" align="center" justify="center">
        <ActionIcon
          size="md"
          variant="light"
          radius="xl"
          color={handleProcessColor(process)}
          onClick={() => {
            modals.open({
              title: `${title} in Bearbeitung setzen`,
              children: (
                <>
                  <Button fullWidth color="black" variant="filled">
                    Reset Process
                  </Button>
                </>
              ),
            });
          }}
        >
          {process === "open" && (
            <IconCircle
              stroke={1.5}
              style={{ width: "100%", height: "100%" }}
            />
          )}
          {process === "ongoing" && (
            <IconCircleDashed
              stroke={1.5}
              style={{ width: "100%", height: "100%" }}
            />
          )}
          {process === "completed" && (
            <IconCircleCheck
              stroke={1.5}
              style={{ width: "100%", height: "100%" }}
            />
          )}
          {process === "incomplete" && (
            <IconCircleX
              style={{ width: "100%", height: "100%" }}
              stroke={1.5}
            />
          )}
          {process === "archived" && (
            <IconCircleOff
              style={{ width: "100%", height: "100%" }}
              stroke={1.5}
            />
          )}
        </ActionIcon>

        <Divider
          orientation="vertical"
          color={handleProcessColor(process)}
          size="sm"
          className="min-h-[50px]"
          classNames={{
            root: "process-divider",
          }}
        />
      </Stack>
      <Stack gap={rem(4)} align="flex-start">
        <Button
          color="black"
          variant="subtle"
          size="compact-md"
          loading={isPending}
          onClick={() => startTransition(() => router.push(href))}
        >
          {title}
        </Button>
        <Text size="sm" c="dimmed">
          {description}
        </Text>
      </Stack>
    </Flex>
  );
};
