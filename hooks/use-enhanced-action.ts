"use client";
import { useServerAction } from "zsa-react";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { modals } from "@mantine/modals";
import { v4 as uuidv4 } from "uuid";

export type EnhancedActionProps = {
  action: any;
  redirectUrl?: string;
  hideModals?: boolean;
  onStart?: () => void;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
};

export const useEnhancedAction = ({
  action,
  redirectUrl,
  hideModals,
  onStart,
  onSuccess,
  onError,
}: EnhancedActionProps) => {
  const router = useRouter();
  const executeNotification = uuidv4();
  const { data, isPending, isError, error, isSuccess, status, execute, reset } =
    useServerAction(action, {
      onError: ({ err }) => {
        if (!err) {
          return;
        }

        notifications.hide(executeNotification);

        notifications.show({
          id: uuidv4(),
          withBorder: true,
          autoClose: 5000,
          title: "Error",
          message: err ? err : "There was an error please try again",
          color: "red",
        });

        if (onError && error) {
          onError(error);
        }
      },
      onSuccess: ({ data }) => {
        if (!data) {
          return;
        }

        notifications.hide(executeNotification);

        notifications.show({
          id: uuidv4(),
          withBorder: true,
          autoClose: 5000,
          title: "Success",
          message: data.message as string,
          color: "green",
        });

        if (hideModals) {
          modals.closeAll();
        }

        if (redirectUrl) {
          router.push(redirectUrl);
        }

        if (onSuccess && data) {
          onSuccess(data);
        }

        return data;
      },
      onStart: () => {
        notifications.show({
          id: executeNotification,
          withCloseButton: false,
          loading: true,
          withBorder: true,
          autoClose: false,
          title: "Executing",
          message: "Bitte warten",
          color: "yellow",
        });
        if (onStart) {
          onStart();
        }
      },
      onFinish: ([data, err]) => {
        console.log("Server action finished (invoked after onError/onSuccess)");
      },
      retry: {
        maxAttempts: 3,
        delay: 1000, // or (currentAttempt, err) => { /* ... */ }
      },
    });

  return { data, isPending, isError, error, isSuccess, status, execute, reset };
};
