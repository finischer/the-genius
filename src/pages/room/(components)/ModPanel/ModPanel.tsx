import { Accordion, Button, ButtonProps, Drawer, Flex, ScrollArea, Title } from '@mantine/core';
import React from 'react';
import { type TGameNames } from '~/games/game.types';
import { useRoom } from '~/hooks/useRoom';
import { socket } from '~/hooks/useSocket';
import { type IModPanelProps } from './modPanel.types';
import { useLocalStorage } from '@mantine/hooks';
import { useRouter } from 'next/router';
import useNotification from '~/hooks/useNotification';

const ModPanel: React.FC<IModPanelProps> = ({ disclosure }) => {
    const { showErrorNotification, showSuccessNotification } = useNotification()
    const router = useRouter();
    const [openedItems, setOpenedItems] = useLocalStorage<string[]>({ key: "modPanelOpenedItems", defaultValue: [] })

    const { room, currentGame } = useRoom()
    const [isOpen, { close: closeModPanel }] = disclosure;
    const btnVariantDefault: ButtonProps = { variant: "default" }
    const titleOrder = 3

    const gameBtns = room.games.map(g => {
        const btnDisabled = g.identifier === currentGame?.identifier

        return (
            <Button
                {...btnVariantDefault}
                key={g.identifier}
                disabled={btnDisabled}
                onClick={() => startGame(g.identifier)}
            >
                {g.name} {btnDisabled && "(Läuft gerade)"}
            </Button>
        )
    })

    const startGame = (gameIdentifier: TGameNames) => {
        console.log("+++ room - Start game +++ ", gameIdentifier)
        socket.emit("startGame", ({ gameIdentifier }))
    }

    const closeRoom = () => {
        socket.emit("closeRoom", ({ roomId: room.id }), ({ closeSuccessful }) => {
            if (closeSuccessful) {
                showSuccessNotification({
                    message: "Raum wurde geschlossen"
                })
                router.push("/rooms")
            } else {
                showErrorNotification({
                    message: "Raum konnte nicht geschlossen werden"
                })
            }
        })
    }

    return (
        <Drawer
            opened={isOpen}
            onClose={closeModPanel}
            title={<Title order={2}>Mod-Panel</Title>}
            size="xs"
            overlayProps={{
                opacity: 0.15,
            }}
            scrollAreaComponent={ScrollArea.Autosize}
        >
            <Flex h="100%" direction="column" gap="xl" justify="space-between">
                <Flex direction="column" gap="sm">
                    <Accordion defaultValue={openedItems} variant='separated' multiple onChange={setOpenedItems}>
                        <Accordion.Item value='startGame'>
                            <Accordion.Control>
                                <Title order={titleOrder}>Spiel starten</Title>
                            </Accordion.Control>
                            <Accordion.Panel  >
                                <Button.Group orientation='vertical'>
                                    {gameBtns}
                                </Button.Group>
                            </Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item value='views'>
                            <Accordion.Control>
                                <Title order={titleOrder}>Ansichten</Title>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Button.Group orientation='vertical' >
                                    <Button {...btnVariantDefault}>Leer</Button>
                                    <Button {...btnVariantDefault}>Scoreboard</Button>
                                </Button.Group>
                            </Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item value='actions'>
                            <Accordion.Control>
                                <Title order={titleOrder}>Aktionen</Title>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Button.Group orientation='vertical' >
                                    <Button {...btnVariantDefault}>10s Timer starten</Button>
                                    <Button {...btnVariantDefault}>Buzzer freigeben</Button>
                                    <Button {...btnVariantDefault}>Konfetti regnen lassen</Button>
                                    <Button {...btnVariantDefault} disabled>Musik starten</Button>
                                </Button.Group>
                            </Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item value='sounds'>
                            <Accordion.Control>
                                <Title order={titleOrder}>Sounds</Title>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Button.Group orientation='vertical' >
                                    <Button {...btnVariantDefault} disabled>Korrekte Antwort</Button>
                                    <Button {...btnVariantDefault} disabled>Falsche Antwort</Button>
                                    <Button {...btnVariantDefault} disabled>Winner Sound</Button>
                                </Button.Group>
                            </Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item value='general'>
                            <Accordion.Control>
                                <Title order={titleOrder}>Allgemein</Title>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Button.Group orientation='vertical'>
                                    <Button color='red' onClick={closeRoom}>Raum schließen</Button>
                                </Button.Group>
                            </Accordion.Panel>
                        </Accordion.Item>

                    </Accordion>
                </Flex>

                {/* <Flex direction="column" gap="sm">
                    
                    
                </Flex>

                <Flex direction="column" gap="sm">
                    <Title order={titleOrder}>Aktionen</Title>
                    <Button.Group orientation='vertical' >
                        <Button {...btnVariantDefault}>10s Timer starten</Button>
                        <Button {...btnVariantDefault}>Buzzer freigeben</Button>
                        <Button {...btnVariantDefault}>Konfetti regnen lassen</Button>
                        <Button {...btnVariantDefault} disabled>Musik starten</Button>
                    </Button.Group>
                </Flex>

                <Flex direction="column" gap="sm">
                    <Title order={titleOrder}>Sounds</Title>
                    <Button.Group orientation='vertical' >
                        <Button {...btnVariantDefault} disabled>Korrekte Antwort</Button>
                        <Button {...btnVariantDefault} disabled>Falsche Antwort</Button>
                        <Button {...btnVariantDefault} disabled>Winner Sound</Button>
                    </Button.Group>
                </Flex>

                <Flex direction="column" gap="sm">
                    <Title order={titleOrder}>Allgemein</Title>
                    <Button.Group orientation='vertical'>
                        <Button color='red' disabled>Raum schließen</Button>
                    </Button.Group>
                </Flex> */}
            </Flex>
        </Drawer >
    )
}

export default ModPanel