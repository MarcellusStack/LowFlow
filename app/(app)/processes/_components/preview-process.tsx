"use client";
import { SurveyPreview } from "@components/survey-preview";
import { ActionIcon, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconFileSearch } from "@tabler/icons-react";
import React from "react";

export const PreviewProcess = ({ json }: { json: Object }) => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <ActionIcon onClick={open} color="black" variant="subtle">
        <IconFileSearch style={{ width: "70%", height: "70%" }} stroke={1.5} />
      </ActionIcon>
      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        title="Preview"
        size="50%"
      >
        <SurveyPreview json={json} />
      </Drawer>
    </>
  );
};
