import { useEnhancedAction } from "@hooks/use-enhanced-action";
import { Button, ButtonProps } from "@mantine/core";
import React from "react";

type ButtonActionProps = ButtonProps & {
  action: any;
  values?: { [key: string]: any };
  redirectUrl?: string;
  hideModals?: boolean;
};

export const ButtonAction = ({
  action,
  values,
  redirectUrl,
  hideModals,
  ...props
}: ButtonActionProps) => {
  const { execute, isPending } = useEnhancedAction({
    action: action,
    ...(hideModals && { hideModals: true }),
    ...(redirectUrl && { redirectUrl: redirectUrl }),
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
