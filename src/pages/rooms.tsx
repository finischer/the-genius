import { Loader, Table, Text, Title } from '@mantine/core'
import { useRouter } from 'next/router'
import PageLayout from '~/components/layout'
import { api } from '~/utils/api'

type Room = {
    id: string,
    name: string,
    modus: "1vs1" | "2vs2"
    players: number
    currentGame: string
    creator: string
}

// const rooms: Room[] = [
//     { id: "1", name: "Mein Raum", modus: "1vs1", players: 3, currentGame: "Buchstabensalat", creator: "Niklas" },
//     { id: "2", name: "Mein Raum", modus: "1vs1", players: 3, currentGame: "Buchstabensalat", creator: "Niklas" },
//     { id: "3", name: "Mein Raum", modus: "1vs1", players: 3, currentGame: "Buchstabensalat", creator: "Niklas" },
//     { id: "4", name: "Mein Raum", modus: "1vs1", players: 3, currentGame: "Buchstabensalat", creator: "Niklas" },

// ];



const RoomsPage = () => {
    const router = useRouter();
    const { data: rooms, isLoading } = api.rooms.getAll.useQuery()

    if (!rooms) return <div>404</div>

    const rows = rooms?.map(room => {
        return (
            <tr key={room.id} style={{ cursor: "pointer" }} onClick={() => handleRoomClick(room.id)}>
                <td>{room.name}</td>
                <td>{room.modus}</td>
                <td>{room.players.length} / {room.roomSize}</td>
                <td>{room.currentGame ?? "-"}</td>
                <td>{room.creator.username}</td>
                <td>{room.createdAt?.toLocaleString()} Uhr</td>
            </tr>
        )
    })

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