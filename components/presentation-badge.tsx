import {
  presentationStatus,
  PresentationStatus,
  StatusValue,
} from "@constants/presentation-status";
import { Badge } from "@mantine/core";
import React from "react";

import { capitalizeFirstLetter } from "@utils/capitalize-first-letter";

const getStatusDetails = (status: StatusValue): PresentationStatus => {
  const statusDetail = presentationStatus.find((item) => item.value === status);
  return (
    statusDetail || {
      value: "archived",
      label: "Archived",
      color: "gray",
    }
  );
};

export const PresentationStatusBadge = ({
  status,
}: {
  status: StatusValue;
}) => {
  const { label, color } = getStatusDetails(status);
  return (
    <Badge color={color} radius="sm">
      {capitalizeFirstLetter(label)}
    </Badge>
  );
};
