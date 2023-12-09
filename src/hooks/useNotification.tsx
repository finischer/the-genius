import { type NotificationProps, notifications } from "@mantine/notifications";
import { IconInfoCircle } from "@tabler/icons-react";
import type { ZodError, typeToFlattenedError } from "zod";

const useNotification = () => {
  const showErrorNotification = (notification: NotificationProps) => {
    notifications.show({
      ...notification,
      color: "red",
    });
  };

  const showSuccessNotification = (notification: NotificationProps) => {
    notifications.show({
      ...notification,
      color: "green",
    });
  };

  const showInfoNotification = (notification: NotificationProps) => {
    notifications.show({
      ...notification,
      icon: <IconInfoCircle />,
    });
  };

  const handleZodError = (
    errorList: typeToFlattenedError<any, string> | null | undefined,
    defaultErrorMsg: string
  ) => {
    if (!errorList) {
      showErrorNotification({
        message: defaultErrorMsg,
      });
      return;
    }

    for (const value of Object.values(errorList.fieldErrors)) {
      value?.forEach((v) =>
        showErrorNotification({
          message: v,
        })
      );
    }
  };

  return {
    showErrorNotification,
    showSuccessNotification,
    showInfoNotification,
    handleZodError,
  };
};

export default useNotification;
