"use client";
import { Button, type ButtonProps, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import React from "react";

export type ButtonModal = ButtonProps & {
  content: React.ReactNode;
};

export const ButtonModal = ({ content, ...props }: ButtonModal) => {
  return (
    <Button
      color="black"
      {...props}
      onClick={() => {
        modals.open({
          title: `${props.children}`,
          children: (
            <>
              <Stack gap="sm">{content}</Stack>
            </>
          ),
        });
      }}
    >
      {props.children}
    </Button>
  );
};
