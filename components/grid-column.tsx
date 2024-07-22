import { GridCol } from "@mantine/core";
import React from "react";

export type GridColumnProps = {
  column: 1 | 2 | 3 | 4;
  children: React.ReactNode;
};

export const GridColumn = ({ column, children }: GridColumnProps) => {
  if (column === 4) {
    return (
      <GridCol span={{ base: 12, sm: 12, md: 6, xl: 4 }}>{children}</GridCol>
    );
  }
  return null;
};
