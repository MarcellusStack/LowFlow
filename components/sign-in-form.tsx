"use client";
import { useEnhancedAction } from "@hooks/use-enhanced-action";
import { Button } from "@mantine/core";
import { signInAction } from "@server/_actions";
import { IconBrandGoogle } from "@tabler/icons-react";
import React from "react";

export const SignInForm = () => {
  const { isPending, execute } = useEnhancedAction({
    action: signInAction,
    notification: false,
  });
  return (
    <>
      {process.env.NEXT_PUBLIC_GOOGLE_LOGIN === "enable" && (
        <Button
          loading={isPending}
          onClick={() => {
            execute({});
          }}
          variant="light"
          leftSection={
            <IconBrandGoogle style={{ width: "70%", height: "70%" }} />
          }
          color="red"
        >
          Continue with Google
        </Button>
      )}
    </>
  );
};
