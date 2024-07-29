import { useEnhancedAction } from "@hooks/use-enhanced-action";
import { ActionIcon, ActionIconProps } from "@mantine/core";
import React from "react";

type ActionIconActionProps = ActionIconProps & {
  action: any;
  values?: { [key: string]: any };
  redirectUrl?: string;
  hideModals?: boolean;
};

export const ActionIconAction = ({
  action,
  values,
  redirectUrl,
  hideModals,
  ...props
}: ActionIconActionProps) => {
  const { execute, isPending } = useEnhancedAction({
    action: action,
    ...(hideModals && { hideModals: true }),
    ...(redirectUrl && { redirectUrl: redirectUrl }),
  });

  return (
    <ActionIcon
      {...props}
      loading={isPending}
      onClick={() => {
        execute({ ...values });
      }}
      color="black"
      variant="subtle"
    >
      {props.children}
    </ActionIcon>
  );
};
