import { ActionIcon, Button, CopyButton, Flex, Modal, Table, Text } from '@mantine/core'
import { IconCheck, IconCopy } from '@tabler/icons-react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { socket } from '~/hooks/useSocket'
import { type IRoomDetailsModalProps } from './roomDetailsModal.types'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'

const RoomDetailsModal: React.FC<IRoomDetailsModalProps> = ({ openedModal, onClose, room }) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()
    const roomId = router.query.id as string

    const leaveRoom = async () => {

        modals.openConfirmModal({
            id: "leaveRoom",
            title: 'Bist du dir sicher?',
            children: (
                <Text size="sm">
                    Möchtest du wirklich den Raum verlassen?
                </Text>
            ),
            labels: { confirm: 'Ja', cancel: 'Nein' },
            onConfirm: async () => {
                setIsLoading(true)
                notifications.show({
                    id: "leaveRoom",
                    title: "Raum verlassen",
                    message: "Du verlässt jetzt den Raum",
                    loading: true
                })
                socket.emit("leaveRoom", { roomId })
                // initUser();
                const routeDone = await router.push("/rooms/")
                if (routeDone) {
                    setIsLoading(false)
                    notifications.update({
                        id: "leaveRoom",
                        title: "Erfolgreich",
                        message: "Raum erfolgreich verlassen",
                        icon: <IconCheck size="1rem" />
                    })
                }
            },
        });
    }

    return (
        <Modal opened={openedModal} onClose={onClose} title="Rauminformationen" centered>
            <Flex direction="column" gap="xl">
                <Table>
                    <tbody>
                        <tr>
                            <td>Raum-ID:</td>
                            <td>{room.id}</td>
                            <td style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <CopyButton timeout={2000} value={room.id}>
                                    {({ copied, copy }) => (
                                        copied ?
                                            <IconCheck size="1.5rem" />
                                            :
                                            <ActionIcon size="1.5rem" onClick={copy}>
                                                <IconCopy />
                                            </ActionIcon>

                                    )}
                                </CopyButton>
                            </td>
                        </tr>
                        <tr>
                            <td>Name:</td>
                            <td>{room.name}</td>
                        </tr>
                        <tr>
                            <td>Erstellt von:</td>
                            <td>{room.creator?.username || "-"}</td>
                        </tr>
                        <tr>
                            <td>Modus:</td>
                            <td>{room.modus}</td>
                        </tr>
                        <tr>
                            <td>Anzahl Spiele:</td>
                            <td>{room.games.length}</td>
                        </tr>
                        <tr>
                            <td>Sichtbarkeit:</td>
                            <td>{room.isPrivateRoom ? "Privat" : "Öffentlich"}</td>
                        </tr>
                    </tbody>
                </Table>

                <Button variant='subtle' onClick={leaveRoom} loading={isLoading}>
                    Raum verlassen
                </Button>
            </Flex>

        </Modal>
    )
}

export default RoomDetailsModal