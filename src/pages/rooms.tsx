import { Table, Text, Title } from '@mantine/core'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import PageLayout from '~/components/layout'
import { socket } from '~/hooks/useSocket'
import { api } from '~/utils/api'
import { IRoom } from './api/classes/Room/room.types'

const RoomsPage = () => {
    const router = useRouter();
    const [rooms, setRooms] = useState<IRoom[]>([])
    const { data, isLoading } = api.rooms.getAll.useQuery()


    useEffect(() => {
        socket.emit("listAllRooms", (rooms) => {
            setRooms(rooms)
        })

        socket.on("updateAllRooms", ({ newRooms }) => {
            setRooms(newRooms)
        })

        return () => {

        }
    }, [])

    if (isLoading) return <PageLayout showLoader loadingMessage='Räume werden geladen ...' />

    const rows = rooms?.map(room => {
        return (
            <tr key={room.id} style={{ cursor: "pointer" }} onClick={() => handleRoomClick(room.id)}>
                <td>{room.name}</td>
                <td>{room.modus}</td>
                <td>{room.participants.length} / {room.roomSize}</td>
                <td>{room.currentGame ?? "-"}</td>
                <td>{room.creator?.username}</td>
                <td>{room.createdAt?.toLocaleString()} Uhr</td>
            </tr>
        )
    }) ?? []

    const handleRoomClick = (roomId: string) => {
        void router.push(`/room/${roomId}`)
    }


    return (
        <PageLayout showLoader={isLoading} loadingMessage='Räume werden geladen ...'>
            <Title order={2}>Tritt einem Raum bei</Title>
            <Text c="dimmed">{rows.length} Räume sind verfügbar</Text>
            <Table verticalSpacing="md" striped highlightOnHover>
                <thead>
                    <tr>
                        <th>Name</th>
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
    )
}

export default RoomsPage