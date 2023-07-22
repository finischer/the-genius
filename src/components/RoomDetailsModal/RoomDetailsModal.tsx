import { ActionIcon, Button, CopyButton, Flex, Modal, Table } from '@mantine/core'
import { IconCheck, IconCopy } from '@tabler/icons-react'
import { useRouter } from 'next/router'
import React from 'react'
import { socket } from '~/hooks/useSocket'
import { type IRoomDetailsModalProps } from './roomDetailsModal.types'

const RoomDetailsModal: React.FC<IRoomDetailsModalProps> = ({ openedModal, onClose, room }) => {
    const router = useRouter()
    const roomId = router.query.id as string

    const leaveRoom = async () => {
        if (window.confirm("Möchtest du wirklich den Raum verlassen?")) {
            socket.emit("leaveRoom", { roomId })
            // initUser();
            await router.push("/rooms/")
        }
    }

    return (
        <Modal opened={openedModal} onClose={onClose} title="Rauminformationen">
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

                <Button variant='subtle' onClick={leaveRoom}>
                    Raum verlassen
                </Button>
            </Flex>

        </Modal>
    )
}

export default RoomDetailsModal