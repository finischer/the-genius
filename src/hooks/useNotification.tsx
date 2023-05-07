import { NotificationProps, notifications } from '@mantine/notifications'
import React from 'react'

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