import { Flex, Table, Text, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { type Gameshow } from '@prisma/client'
import { IconPlayerPlay, IconSettings, IconStar, IconStarFilled } from '@tabler/icons-react'
import React, { useState } from 'react'
import ActionIcon from '~/components/ActionIcon'
import CreateRoomModal from '~/components/CreateRoomModal/CreateRoomModal'
import PageLayout from '~/components/layout'
import { api } from '~/utils/api'

const GameshowsPage = () => {
    const { data: gameshows, isLoading } = api.gameshows.getAllByCreatorId.useQuery()
    const [openedCreateRoomModal, { open: openCreateRoomModal, close: closeCreateRoomModal }] = useDisclosure(false)
    const [activeGameshow, setActiveGameshow] = useState<Gameshow | undefined>(undefined)

    const subtitleText = gameshows?.length === 0 ? "Du hast bisher noch keine Spielshow erstellt" : `Du hast bereits ${gameshows?.length || "NOT_FOUND"} Spielshows erstellt`

    const createRoom = (gameshow: Gameshow) => {
        setActiveGameshow(gameshow)
        openCreateRoomModal()
    }

    const rows = gameshows?.map(gameshow => {
        return (
            <tr key={gameshow.id}>
                <td>{gameshow.name}</td>
                <td>{gameshow.games.length}</td>
                <td>{gameshow.createdAt.toLocaleString()}</td>
                <td>
                    <Flex gap="xl">
                        <ActionIcon toolTip='Bearbeiten' disabled >
                            <IconSettings />
                        </ActionIcon>
                        <ActionIcon toolTip='Als Favorit hinzufügen' color='yellow' disabled>
                            {gameshow.isFavorite ?
                                <IconStarFilled /> : <IconStar />
                            }
                        </ActionIcon>
                        <ActionIcon toolTip='Raum erstellen' color="green">
                            <IconPlayerPlay onClick={() => createRoom(gameshow)} />
                        </ActionIcon>
                    </Flex>
                </td>
            </tr>
        )
    }) ?? []

    return (
        <PageLayout showLoader={isLoading} loadingMessage='Spielshows werden geladen ...'>
            <CreateRoomModal openedModal={openedCreateRoomModal} onClose={closeCreateRoomModal} gameshow={activeGameshow} />
            <Title order={2}>Meine Spielshows</Title>
            <Text c="dimmed">{subtitleText}</Text>
            <Table verticalSpacing="md" striped>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Anzahl Spiele</th>
                        <th>Erstellt am</th>
                        <th>Aktion</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </PageLayout>
    )
}

export default GameshowsPage