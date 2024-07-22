import React from "react";
import {
  Burger,
  Fieldset as FormField,
  type FieldsetProps as FormFieldsetProps,
  Group,
  Spoiler,
  Text,
} from "@mantine/core";

export type FieldsetProps = FormFieldsetProps & {
  id?: string;
  legend: string;
  spoiler?: boolean;
  children: React.ReactNode;
};

export const Fieldset = ({
  id,
  legend,
  spoiler = true,
  children,
  ...props
}: FieldsetProps) => {
  if (!spoiler) {
    return (
      <FormField
        p="sm"
        id={id}
        legend={
          <Text fw={700} size="xl">
            {legend}
          </Text>
        }
        {...props}
      >
        {children}
      </FormField>
    );
  }
  return (
    <FormField
      p="sm"
      id={id}
      legend={
        <Text fw={700} size="xl">
          {legend}
        </Text>
      }
      {...props}
    >
      <Spoiler maxHeight={0} showLabel="Show more" hideLabel="Show less">
        {children}
      </Spoiler>
    </FormField>
  );
};
