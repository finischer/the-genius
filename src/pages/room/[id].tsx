import { ActionIcon, Box, Center, Container, Flex, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconInfoSmall } from '@tabler/icons-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Loader from '~/components/Loader/Loader'
import RoomDetailsModal from '~/components/RoomDetailsModal'
import Scorebar from '~/components/Scorebar'
import { useRoom } from '~/hooks/useRoom/useRoom'
import { socket } from '~/hooks/useSocket'
import { useUser } from '~/hooks/useUser/useUser'
import { colors, sizes } from '~/styles/constants'
import { type TUserReduced } from '~/types/socket.types'
import { type IRoom } from '../api/classes/Room/room.types'
import ContainerBox from '~/components/ContainerBox/ContainerBox'


const RoomPage = () => {
    const router = useRouter()
    const { data: session } = useSession();
    const [openedRoomDetails, { open: openRoomDetails, close: closeRoomDetails }] = useDisclosure(false)
    const { room, currentGame, setRoom } = useRoom()
    const { isHost } = useUser()

    const roomId = router.query.id as string

    useEffect(() => {
        if (session?.user) {
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
                    message: `${user?.name || ""} hat den Raum verlassen`,
                })
            })

            socket.on("updateRoom", ({ newRoomState }) => {
                setRoom(newRoomState)
            })
        }

        return () => {
            socket.removeAllListeners("userLeftRoom")
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
            <RoomDetailsModal room={room} openedModal={openedRoomDetails} onClose={closeRoomDetails} />
            <Flex h="100vh" p={sizes.padding} pos="relative" direction="column">
                {/* Moderation Buttons */}
                {/* TODO */}

                {/* Header */}
                <Container size="100%" w="100%" pos="relative">
                    {/* Room Info Button */}
                    <ActionIcon color={colors.accent} size="xl" radius="xl" variant="filled" onClick={openRoomDetails}>
                        <IconInfoSmall size="3.25rem" />
                    </ActionIcon>

                    {/* Current Game */}
                    {currentGame &&
                        <ContainerBox
                            px="xl"
                            bg={colors.accent}
                            pos="absolute"
                            h="100%"
                            right={0}
                            top={0}
                            contentCentered
                            withShadow
                        >
                            <Text>{currentGame?.name}</Text>
                        </ContainerBox>
                    }
                </Container>

                {/* Main View */}
                <Flex h="100%" align="center" justify="center" >
                    <Text>Bist du der Host: {isHost.toString()} </Text>
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