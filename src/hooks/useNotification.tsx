import { NotificationProps, notifications } from '@mantine/notifications'

const useNotification = () => {

    const showErrorNotification = (notification: NotificationProps) => {
        notifications.show({
            ...notification,
            color: "red",
        })
    }


    return {
        showErrorNotification
    }
}

export default useNotification