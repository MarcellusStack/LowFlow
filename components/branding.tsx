import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Box, Text } from "@mantine/core";

export const Branding = () => {
  return (
    <Link
      href="/"
      passHref
      className="flex items-center gap-3 text-black"
      style={{ textDecoration: "none" }}
    >
      <Box className="p-3 rounded-sm bg-gray-100 grid place-items-center">
        <Image src="/branding.png" width={32} height={32} alt="branding" />
      </Box>
      <Text fw={700} size="xl">
        LowFlow
      </Text>
    </Link>
  );
};
