import { Box, Center, Container, Flex, Text } from '@mantine/core'
import { useDisclosure, useNetwork } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconArrowRight, IconInfoSmall, IconWifi, IconWifi0, IconWifi1, IconWifi2, IconWifiOff } from '@tabler/icons-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import ActionIcon from '~/components/ActionIcon/ActionIcon'
import ContainerBox from '~/components/ContainerBox/ContainerBox'
import Loader from '~/components/Loader/Loader'
import RoomDetailsModal from '~/components/RoomDetailsModal'
import Scorebar from '~/components/Scorebar'
import useNotification from '~/hooks/useNotification'
import { useRoom } from '~/hooks/useRoom'
import { socket } from '~/hooks/useSocket'
import { useUser } from '~/hooks/useUser'
import { colors, sizes } from '~/styles/constants'
import { type TUserReduced } from '~/types/socket.types'
import { type IRoom } from '../api/classes/Room/room.types'
import ModPanel from './(components)/ModPanel/ModPanel'
import Game from '~/games'


type TNetworkStatusEffectiveType = 'slow-2g' | '2g' | '3g' | '4g'


const NETWORK_STATUS_ICON_MAP: { [key in TNetworkStatusEffectiveType]: React.ReactNode } = {
    "slow-2g": <IconWifi0 color="red" />,
    "2g": <IconWifi1 color='orange' />,
    "3g": <IconWifi2 color='yellow' />,
    "4g": <IconWifi color='green' />
}


const RoomPage = () => {
    const { showInfoNotification } = useNotification()
    const router = useRouter()
    const { data: session } = useSession();
    const [openedRoomDetails, { open: openRoomDetails, close: closeRoomDetails }] = useDisclosure(false)
    const { room, currentGame, setRoom } = useRoom()
    const { isHost, team } = useUser()
    const modPanelDisclosure = useDisclosure(false);
    const networkStatus = useNetwork();



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

            socket.on("roomWasClosed", () => {
                showInfoNotification({
                    message: "Raum wurde geschlossen"
                })
                router.push("/rooms")
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
                {isHost &&
                    <>
                        <Box pos="absolute" bottom="50%" >
                            <ActionIcon variant='filled' toolTip='Spiele anzeigen'>
                                <IconArrowRight onClick={modPanelDisclosure[1].open} />
                            </ActionIcon>
                        </Box>
                        <ModPanel disclosure={modPanelDisclosure} />
                    </>
                }

                {/* Header */}
                <Container size="100%" w="100%" pos="relative">
                    <Flex align="center" gap="sm">

                        {/* Room Info Button */}
                        <ActionIcon color={colors.accent} size="xl" radius="xl" variant="filled" onClick={openRoomDetails} >
                            <IconInfoSmall size="3.25rem" />
                        </ActionIcon>
                        {/* Connection status */}
                        {!networkStatus.online && <IconWifiOff />}
                        {networkStatus.online && networkStatus.effectiveType && NETWORK_STATUS_ICON_MAP[networkStatus.effectiveType]}
                        {networkStatus.rtt}
                    </Flex>

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
                            <Text>{currentGame.name}</Text>
                        </ContainerBox>
                    }
                </Container>

                {/* Main View */}
                <Flex h="100%" align="center" justify="center" direction="column" >
                    {/* <Text>Bist du der Host: {isHost.toString()} </Text>
                    {team && <Text>Dein Team: {team.name}</Text>} */}
                    {currentGame && <Game game={currentGame} />}
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