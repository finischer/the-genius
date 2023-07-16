import { ActionIcon, Button, Center, Container, CopyButton, Flex, Modal, Table } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconCheck, IconCopy, IconInfoSmall } from '@tabler/icons-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Loader from '~/components/Loader/Loader'
import { useRoom } from '~/hooks/useRoom/useRoom'
import { socket } from '~/hooks/useSocket'
import { colors, sizes } from '~/styles/constants'
import { TUserReduced } from '~/types/socket.types'
import { type IRoom } from '../api/classes/Room/room.types'
import Scorebar from './components/Scorebar/Scorebar'
import RoomDetailsModal from './components/RoomDetailsModal/RoomDetailsModal'

const RoomPage = () => {
    const router = useRouter()
    const { data: session } = useSession();
    const [openedRoomDetails, { open: openRoomDetails, close: closeRoomDetails }] = useDisclosure(false)
    const { room, setRoom } = useRoom()

    const roomId = router.query.id as string

    useEffect(() => {
        console.log("Use effect: ", session)
        if (session?.user) {
            console.log("Session available")
            console.log("Socket: ", socket)

            const user: TUserReduced = {
                id: session.user.id,
                username: session.user.name || "",
                email: session.user.email || "",
                image: session.user.image || null,
                role: session.user.role
            }

            socket.emit("joinRoom", { user, roomId }, (room: IRoom) => {
                setRoom(room)
            })

            socket.on("userLeftRoom", ({ user }) => {
                notifications.show({
                    message: `${user?.name} hat den Raum verlassen`,
                })
            })

            socket.on("updateRoom", ({ newRoomState }) => {
                console.log("Update Room!")
                setRoom(newRoomState)
            })
        }

        return () => {
            socket.removeAllListeners("userLeftRoom")
        }
    }, [session])

    const leaveRoom = () => {
        if (window.confirm("Möchtest du wirklich den Raum verlassen?")) {
            socket.emit("leaveRoom", { roomId })
            // initUser();
            router.push("/rooms/")
        }
    }

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
            <RoomDetailsModal room={room} openedModal={openedRoomDetails} onClose={closeRoomDetails} />

            <Flex h="100vh" p={sizes.padding} pos="relative" direction="column">
                {/* Header */}
                <Container size="100%" w="100%">
                    {/* Room Info Button */}
                    <ActionIcon color={colors.accent} size="xl" radius="xl" variant="filled" onClick={openRoomDetails}>
                        <IconInfoSmall size="3.25rem" />
                    </ActionIcon>
                </Container>

                {/* Main View */}
                <Flex h="100%" align="center" justify="center" >

                </Flex>

                {/* Footer View */}
                <Flex justify="space-between" >
                    <Scorebar team={room.teams.teamOne} />
                    <Scorebar team={room.teams.teamTwo} />
                </Flex>

            </Flex >
        </>
    )
}

export default RoomPage