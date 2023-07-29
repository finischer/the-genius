import { Accordion, Button, ButtonProps, Drawer, Flex, ScrollArea, Title } from '@mantine/core';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import { IconQuestionMark } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { type TGame, type TGameNames } from '~/games/game.types';
import useNotification from '~/hooks/useNotification';
import { useRoom } from '~/hooks/useRoom';
import { socket } from '~/hooks/useSocket';
import { type IModPanelProps } from './modPanel.types';
import Tooltip from '~/components/Tooltip/Tooltip';
import GameRulesModal from '~/components/GameRulesModal/GameRulesModal';

const ModPanel: React.FC<IModPanelProps> = ({ disclosure }) => {
    const { showErrorNotification, showSuccessNotification } = useNotification()
    const router = useRouter();
    const [openedItems, setOpenedItems] = useLocalStorage<string[]>({ key: "modPanelOpenedItems", defaultValue: [] })

    // for game rules
    const [openedGameRules, { open: openGameRules, close: closeGameRules }] = useDisclosure()
    const [clickedGame, setClickedGame] = useState<TGame>()

    const { room, currentGame } = useRoom()
    const [isOpen, { close: closeModPanel }] = disclosure;
    const btnVariantDefault: ButtonProps = { variant: "default" }
    const titleOrder = 3

    const handleOpenGameRules = (game: TGame) => {
        setClickedGame(game)
        openGameRules()
    }

    const gameBtns = room.games.map(g => {
        const btnDisabled = g.identifier === currentGame?.identifier

        return (
            <Button.Group key={g.identifier}>
                <Button
                    {...btnVariantDefault}
                    disabled={btnDisabled}
                    onClick={() => startGame(g.identifier)}
                    w="100%"
                >
                    {g.name} {btnDisabled && "(Läuft gerade)"}
                </Button>
                {g.rules &&
                    <Tooltip label="Regeln anzeigen" openDelay={500} >
                        <Button {...btnVariantDefault} onClick={() => handleOpenGameRules(g)}>
                            <IconQuestionMark />
                        </Button>
                    </Tooltip>
                }
            </Button.Group>
        )
    })

    const startGame = (gameIdentifier: TGameNames) => {
        console.log("+++ room - Start game +++ ", gameIdentifier)
        socket.emit("startGame", ({ gameIdentifier }))
    }

    const closeRoom = () => {
        if (!window.confirm("Möchtest du wirklich den Raum schließen? Der Spielfortschritt geht verloren")) return

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

    return (<>
        {clickedGame && <GameRulesModal zIndex={999} opened={openedGameRules} onClose={closeGameRules} gameName={clickedGame.name} rules={clickedGame.rules} />}
        <Drawer
            opened={isOpen}
            onClose={closeModPanel}
            title={<Title order={2}>Mod-Panel</Title>}
            size="sm"
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
    </>
    )
}

export default ModPanel