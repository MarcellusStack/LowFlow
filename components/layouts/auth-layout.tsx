"use client";
import { Branding } from "@components/branding";
import { UserButton } from "@components/user-button";
import { Box, Center, Flex, Stack } from "@mantine/core";
import React from "react";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box h="100vh">
      <Flex h="100%" w="100%">
        <Stack
          className="w-full md:w-1/2"
          p="md"
          justify="space-between"
          align="center"
        >
          <Flex justify="space-between" className="w-full">
            <Branding />
            <UserButton />
          </Flex>
          <Box h="100%" w="50%" bg="white">
            <Center h="100%">{children}</Center>
          </Box>
          <Box />
        </Stack>
        <Box h="100%" w="50%" bg="black"></Box>
      </Flex>
    </Box>
  );
};
