import {
  processStatus,
  ProcessStatus,
  ProcessValue,
} from "@constants/process-status";
import { Badge } from "@mantine/core";
import React from "react";

import { capitalizeFirstLetter } from "@utils/capitalize-first-letter";

const getStatusDetails = (status: ProcessValue): ProcessStatus => {
  const statusDetail = processStatus.find((item) => item.value === status);
  return (
    statusDetail || {
      value: "archived",
      label: "Archived",
      color: "gray",
    }
  );
};

export const ProcessStatusBadge = ({
  status,
}: {
  status: ProcessValue;
}) => {
  const { label, color } = getStatusDetails(status);
  return (
    <Badge color={color} radius="sm">
      {capitalizeFirstLetter(label)}
    </Badge>
  );
};
