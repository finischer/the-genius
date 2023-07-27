import { type NotificationProps, notifications } from '@mantine/notifications'
import { IconInfoCircle } from '@tabler/icons-react'

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

    const showInfoNotification = (notification: NotificationProps) => {
        notifications.show({
            ...notification,
            icon: <IconInfoCircle />,
        })
    }


    return {
        showErrorNotification,
        showSuccessNotification,
        showInfoNotification
    }
}

export default useNotification