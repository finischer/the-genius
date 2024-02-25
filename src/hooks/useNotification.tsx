import { notifications, type NotificationData } from "@mantine/notifications";
import { IconInfoCircle } from "@tabler/icons-react";
import type { ZodError, typeToFlattenedError } from "zod";

const useNotification = () => {
  const showErrorNotification = (notification: NotificationData) => {
    notifications.show({
      ...notification,
      color: "red",
    });
  };

  const showSuccessNotification = (notification: NotificationData) => {
    notifications.show({
      ...notification,
      color: "green",
    });
  };

  const showInfoNotification = (notification: NotificationData) => {
    notifications.show({
      ...notification,
      icon: <IconInfoCircle />,
    });
  };

  const handleZodError = (
    errorList: typeToFlattenedError<any, string> | null | undefined,
    defaultErrorMsg = "Ein Fehler ist aufgetreten"
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
