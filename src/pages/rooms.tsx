import { Button, Flex, LoadingOverlay, Modal, PasswordInput, Table, Text, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { IconPoint } from '@tabler/icons-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import PageLayout from '~/components/layout'
import useNotification from '~/hooks/useNotification'
import { socket } from '~/hooks/useSocket'
import { colors } from '~/styles/constants'
import { api } from '~/utils/api'
import { type IRoom } from './api/classes/Room/room.types'

type TOnlinePlayersEvent = {
    numOfOnlinePlayers: number
}

const RoomsPage = () => {
    const router = useRouter();
    const { showErrorNotification } = useNotification()

    const { mutate: validatePassword, isLoading: isLoadingValidatePassword } = api.rooms.validatePassword.useMutation({
        onSuccess: (isPasswordValid) => {
            if (isPasswordValid) {
                joinRoom()
            } else {
                form.setFieldError("password", "Falsches Passwort")
            }
        },

        onError: (e) => {
            const errorMessage = e.data?.zodError?.fieldErrors;
            const errorMessagesArray = errorMessage ? Object.values(errorMessage) : []

            if (errorMessagesArray.length > 0) {
                errorMessagesArray.forEach(messages => {
                    if (messages && messages[0]) {
                        showErrorNotification({
                            title: "Ein Fehler ist aufgetreten",
                            message: messages[0]
                        })
                    }
                })
            }
            else {
                showErrorNotification({
                    title: "Ein Fehler ist aufgetreten",
                    message: e.message ?? "Probiere es später nochmal"
                })
            }
        }
    })

    const form = useForm({
        initialValues: {
            password: ""
        }
    })
    const [openedPasswordModal, { open: openPasswordModal, close: closePasswordModal }] = useDisclosure()
    const [rooms, setRooms] = useState<IRoom[]>([])
    const [isLoading, setIsLoading] = useState(true);
    const [activeRoom, setActiveRoom] = useState<IRoom | undefined>(undefined)
    const [playersOnline, setPlayersOnline] = useState<number | undefined>(undefined)

    useEffect(() => {
        socket.emit("listAllRooms", (rooms) => {
            console.log("+++ listAllRooms +++ : ", rooms)
            setRooms(rooms)
            setIsLoading(false)
        })

        // socket.on("getOnlinePlayers", ({ numOfOnlinePlayers }: TOnlinePlayersEvent) => {
        //     console.log("+++ getOnlinePlayers +++ : ", numOfOnlinePlayers)
        //     setPlayersOnline(numOfOnlinePlayers)
        // })

        socket.on("updateAllRooms", ({ newRooms }) => {
            console.log("+++ updateAllRooms +++ : ", newRooms)
            setRooms(newRooms)
        })

        return () => {
            socket.removeAllListeners("updateAllRooms")
        }
    }, [])

    const rows = rooms?.map(room => {
        return (
            <tr key={room.id} style={{ cursor: "pointer" }} onClick={() => handleRoomClick(room)}>
                <td>{room.name}</td>
                <td>{room.isPrivateRoom ? "Privat" : "Öffentlich"}</td>
                <td>{room.modus}</td>
                <td>{room.participants.length} / {room.roomSize}</td>
                <td>{room.currentGame || "Kein Spiel gestartet"}</td>
                <td>{room.creator?.username}</td>
                <td>{room.createdAt?.toLocaleString()} Uhr</td>
            </tr>
        )
    }) ?? []

    const handleRoomClick = (room: IRoom) => {
        setActiveRoom(room)
        if (room.isPrivateRoom) {
            form.reset();
            openPasswordModal()
        } else {
            joinRoom()
        }
    }

    const joinRoom = () => {
        if (!activeRoom) return
        void router.push(`/room/${activeRoom.id}`)
    }

    const handleJoinRoomWithPassword = form.onSubmit(values => {
        if (!activeRoom) return

        // validate password on server side
        validatePassword({
            roomId: activeRoom?.id,
            password: values.password
        })

    })


    return (
        <>
            {activeRoom &&
                <Modal
                    onClose={closePasswordModal}
                    opened={openedPasswordModal}
                    title={`Gib das Passwort für ${activeRoom.name} ein`}
                    centered
                >
                    <LoadingOverlay visible={isLoadingValidatePassword} overlayBlur={2} />
                    <form onSubmit={handleJoinRoomWithPassword}>
                        <Flex direction="column" gap="md">
                            <PasswordInput
                                label="Passwort"
                                placeholder='Super secret passwort'
                                required
                                {...form.getInputProps("password")}
                            />
                            <Button type='submit'>Raum beitreten</Button>
                        </Flex>
                    </form>
                </Modal>
            }
            <PageLayout showLoader={isLoading} loadingMessage='Räume werden geladen ...'>
                <Flex direction="row">
                    <Title order={2} >Tritt einem Raum bei</Title>
                    {/* <Flex align="center">
                        <IconPoint size={24} color={colors.success} fill={colors.success} />
                        <Text>{playersOnline} Spieler online</Text>
                    </Flex> */}
                </Flex>
                <Text c="dimmed">{rows.length} Räume sind verfügbar</Text>
                <Table verticalSpacing="md" striped highlightOnHover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Sichtbarkeit</th>
                            <th>Modus</th>
                            <th>Spieler</th>
                            <th>Aktuelles Spiel</th>
                            <th>Erstellt von</th>
                            <th>Erstellt am</th>
                        </tr>
                    </thead>

                    <tbody>{rows}</tbody>
                </Table>
            </PageLayout>
        </>
    )
}

export default RoomsPage