import { useEnhancedAction } from "@hooks/use-enhanced-action";
import { Button, ButtonProps } from "@mantine/core";
import React from "react";

type ButtonActionProps = ButtonProps & {
  action: any;
  values?: { [key: string]: any };
};

export const ButtonAction = ({
  action,
  values,
  ...props
}: ButtonActionProps) => {
  const { execute, isPending } = useEnhancedAction({
    action: action,
    hideModals: true,
  });

  return (
    <Button
      color="black"
      loading={isPending}
      onClick={() => {
        execute({ ...values });
      }}
      {...props}
    >
      {props.children}
    </Button>
  );
};
