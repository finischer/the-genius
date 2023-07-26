import { Box, Button, Center, Container, Drawer, Flex, Text, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconArrowRight, IconInfoSmall } from '@tabler/icons-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import ActionIcon from '~/components/ActionIcon/ActionIcon'
import ContainerBox from '~/components/ContainerBox/ContainerBox'
import Loader from '~/components/Loader/Loader'
import RoomDetailsModal from '~/components/RoomDetailsModal'
import Scorebar from '~/components/Scorebar'
import { type TGameNames } from '~/games/game.types'
import { useRoom } from '~/hooks/useRoom'
import { socket } from '~/hooks/useSocket'
import { useUser } from '~/hooks/useUser'
import { colors, sizes } from '~/styles/constants'
import { type TUserReduced } from '~/types/socket.types'
import { type IRoom } from '../api/classes/Room/room.types'


const RoomPage = () => {
    const router = useRouter()
    const { data: session } = useSession();
    const [openedRoomDetails, { open: openRoomDetails, close: closeRoomDetails }] = useDisclosure(false)
    const { room, currentGame, setRoom } = useRoom()
    const { isHost } = useUser()
    const [openedModSettings, { open: openModSettings, close: closeModSettings }] = useDisclosure(false);

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

    const startGame = (gameIdentifier: TGameNames) => {
        console.log("+++ room - Start game +++ ", gameIdentifier)
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
                {/* Moderation Buttons */}
                {/* TODO */}
                {isHost &&
                    <>
                        <Box pos="absolute" bottom="50%" >
                            <ActionIcon variant='filled' toolTip='Spiele anzeigen'>
                                <IconArrowRight onClick={openModSettings} />
                            </ActionIcon>
                        </Box>
                        <Drawer opened={openedModSettings} onClose={closeModSettings} title={<Title order={2}>Spiel starten</Title>}>
                            <Flex direction="column" gap="xl">
                                {room.games.map(g => (
                                    <Button
                                        key={g.identifier}
                                        disabled={g.identifier === currentGame?.identifier}
                                        onClick={() => startGame(g.identifier)}
                                    >
                                        {g.name}
                                    </Button>
                                ))}
                            </Flex>
                        </Drawer>
                    </>
                }

                {/* Header */}
                <Container size="100%" w="100%" pos="relative">
                    {/* Room Info Button */}
                    <ActionIcon color={colors.accent} size="xl" radius="xl" variant="filled" >
                        <IconInfoSmall size="3.25rem" onClick={openRoomDetails} />
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