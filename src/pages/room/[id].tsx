import { ActionIcon, Button, Center, Container, CopyButton, Flex, Modal, Table } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconCheck, IconCopy, IconInfoSmall } from '@tabler/icons-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Loader from '~/components/Loader/Loader'
import { socket } from '~/hooks/useSocket'
import { colors, sizes } from '~/styles/constants'
import { type IRoom } from '../api/classes/Room/room.types'

const RoomPage = () => {
    const router = useRouter()
    const { data: session } = useSession();
    const [openedRoomDetails, { open: openRoomDetails, close: closeRoomDetails }] = useDisclosure(false)
    const [room, setRoom] = useState<IRoom | undefined>(undefined);

    const roomId = router.query.id as string

    useEffect(() => {
        console.log("Use effect: ", session)
        if (session?.user) {
            console.log("Session available")
            console.log("Socket: ", socket)
            socket.emit("joinRoom", { user: session?.user, roomId }, (room: IRoom) => {
                setRoom(room)
            })
        }
    }, [session])

    if (room === undefined) {
        return (
            <Center h="100vh" >
                <Loader message='Raum wird geladen ...' />
            </Center>
        )
    }

    return (
        <>
            {/* Room Details */}
            <Modal opened={openedRoomDetails} onClose={closeRoomDetails} title="Rauminformationen">
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
                                <td>{room.gameshowMode}</td>
                            </tr>
                            <tr>
                                <td>Anzahl Spiele:</td>
                                <td>{room.games.length}</td>
                            </tr>
                            <tr>
                                <td>Sichtbarkeit:</td>
                                <td>{room.isPrivateRoom ? "Private" : "Öffentlich"}</td>
                            </tr>
                        </tbody>
                    </Table>

                    <Button variant='subtle' disabled>
                        Raum verlassen
                    </Button>
                </Flex>

            </Modal>

            <Container size="100%" h="100vh" p={sizes.padding}>
                {/* Header */}
                <Container size="100%">
                    {/* Room Info Button */}
                    <ActionIcon color={colors.accent} size="xl" radius="xl" variant="filled" onClick={openRoomDetails}>
                        <IconInfoSmall size="3.25rem" />
                    </ActionIcon>
                </Container>
            </Container>
        </>
    )
}

export default RoomPage