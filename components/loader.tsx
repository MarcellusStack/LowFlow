import { Flex, Loader as Spinner } from "@mantine/core";
import React from "react";

export const Loader = () => {
  return (
    <Flex
      justify="center"
      align="center"
      direction="column"
      style={{ height: "calc(100vh - 137px)" }}
    >
      <Spinner color="black" />
    </Flex>
  );
};
