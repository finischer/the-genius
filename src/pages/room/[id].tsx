import { Alert, Box, Center, Container, Flex, Notification, Text, useMantineTheme } from '@mantine/core'
import { useDisclosure, useNetwork } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconAlertCircle, IconArrowRight, IconCircle, IconInfoSmall, IconWifi, IconWifi0, IconWifi1, IconWifi2, IconWifiOff } from '@tabler/icons-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import ActionIcon from '~/components/shared/ActionIcon'
import ContainerBox from '~/components/shared/ContainerBox'
import GameRulesModal from '~/components/shared/GameRulesModal/GameRulesModal'
import Loader from '~/components/shared/Loader/Loader'
import useNotification from '~/hooks/useNotification'
import { useRoom } from '~/hooks/useRoom'
import { socket } from '~/hooks/useSocket'
import { useUser } from '~/hooks/useUser'
import Game from '~/components/room/Game'
import { type TUserReduced } from '~/types/socket.types'
import RoomDetailsModal from '~/components/room/RoomDetailsModal/RoomDetailsModal'
import { sizes } from '~/styles/constants'
import ModPanel from '~/components/room/ModPanel/ModPanel'
import Scorebar from '~/components/room/Scorebar/Scorebar'
import AnswerBanner from '~/components/room/AnswerBanner/AnswerBanner'
import type { IRoom, TRoomView } from '../api/classes/Room/room.types'
import Scoreboard from '~/components/room/Scoreboard/Scoreboard'

type TNetworkStatusEffectiveType = 'slow-2g' | '2g' | '3g' | '4g'


const NETWORK_STATUS_ICON_MAP: { [key in TNetworkStatusEffectiveType]: React.ReactNode } = {
    "slow-2g": <IconWifi0 color="red" />,
    "2g": <IconWifi1 color='orange' />,
    "3g": <IconWifi2 color='yellow' />,
    "4g": <IconWifi color='green' />
}

const RoomPage = () => {
    const theme = useMantineTheme()
    const { showInfoNotification } = useNotification()
    const router = useRouter()
    const { data: session } = useSession();
    const [openedRoomDetails, { open: openRoomDetails, close: closeRoomDetails }] = useDisclosure(false)
    const [openedGameRules, { open: openGameRules, close: closeGameRules }] = useDisclosure()

    const { room, currentGame, setRoom } = useRoom()
    const { isHost, isPlayer, team } = useUser()
    const modPanelDisclosure = useDisclosure(false);
    const networkStatus = useNetwork();

    const showGame = room?.state.display.game
    const roomId = router.query.id as string

    useEffect(() => {
        // show info banner that no sounds/music are available until we have a license to use it
        notifications.show({
            title: "Info",
            message: "Aus Lizenzgründen stehen Sounds/Musik aktuell nicht zur Verfügung",
            color: "orange",
            icon: <IconAlertCircle size="1rem" />,
            autoClose: false,
        })
    }, [])

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
                void router.push("/rooms")
            })

        }

        return () => {
            socket.removeAllListeners("userLeftRoom")
        }
    }, [session])


    useEffect(() => {
        if (isPlayer) {
            window.addEventListener("keydown", (e) => e.code === "Space" && handleBuzzerClick())
        }

        return () => {
            window.removeEventListener("keydown", handleBuzzerClick)
        }
    }, [isPlayer])

    const handleBuzzerClick = () => {
        if (!isPlayer || room.state.teamWithTurn || !team) return
        socket.emit("buzzer", ({ teamId: team.id, withTimer: true }))
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
            {/* Modals */}
            <RoomDetailsModal room={room} openedModal={openedRoomDetails} onClose={closeRoomDetails} />
            {currentGame && <GameRulesModal gameName={currentGame.name} onClose={closeGameRules} opened={openedGameRules} rules={currentGame.rules} />}

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
                        <ActionIcon color={theme.primaryColor} size="xl" radius="xl" variant="filled" onClick={openRoomDetails} >
                            <IconInfoSmall size="3.25rem" />
                        </ActionIcon>
                        {/* Connection status */}
                        {!networkStatus.online && <IconWifiOff />}
                        {networkStatus.online && networkStatus.effectiveType && NETWORK_STATUS_ICON_MAP[networkStatus.effectiveType]}
                        {networkStatus.rtt}
                    </Flex>

                    {/* Current Game */}
                    {currentGame && showGame &&
                        <ContainerBox
                            px="xl"
                            bg={theme.primaryColor}
                            pos="absolute"
                            h="100%"
                            right={0}
                            top={0}
                            contentCentered
                            withShadow
                            onClick={handleBuzzerClick}
                        >
                            <Text>{currentGame.name}</Text>
                        </ContainerBox>
                    }
                </Container>

                {/* Main View */}
                <Flex h="100%" align="center" justify="center" direction="column" >
                    {/* <Text>Bist du der Host: {isHost.toString()} </Text>
                    {team && <Text>Dein Team: {team.name}</Text>} */}
                    {currentGame && room.state.view === "game" && <Game game={currentGame} />}
                    {room.state.view === "empty" && (
                        <Flex direction="column" gap="xl">
                            <Scoreboard team={room.teams.teamOne} color='green' />
                            <Scoreboard team={room.teams.teamTwo} color='red' />
                        </Flex>

                    )}
                </Flex>

                {/* Footer View */}
                <Flex justify="space-between" align="flex-end">
                    <Scorebar team={room.teams.teamOne} timerPosition='right' />
                    {room.state.answerState.showAnswer && <AnswerBanner answer={room.state.answerState.answer} />}
                    <Scorebar team={room.teams.teamTwo} timerPosition='left' />
                </Flex>
            </Flex >
        </>
    )
}

export default RoomPage