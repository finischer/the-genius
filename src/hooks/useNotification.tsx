import { NotificationProps, notifications } from '@mantine/notifications'

const useNotification = () => {

    const showErrorNotification = (notification: NotificationProps) => {
        notifications.show({
            ...notification,
            color: "red",
        })
    }

    const showSuccessNotification = (notification: NotificationProps) => {
        notifications.show({
            ...notification,
            color: "green"
        })
    }


    return {
        showErrorNotification,
        showSuccessNotification
    }
}

export default useNotification