import { AppShell, Burger, Button, Flex, Footer, Header, MediaQuery, Modal, Text, TextInput, useMantineTheme } from '@mantine/core';
import { signIn, useSession } from 'next-auth/react';
import { PropsWithChildren, useState } from 'react';
import Navbar from './Navbar';
import AuthenticationModal from './modals/AuthenticationModal';

const PageLayout = (props: PropsWithChildren) => {
    const { data: session, update: updateSession } = useSession();
    const theme = useMantineTheme();
    const [isNavbarOpened, setIsNavbarOpened] = useState(false)
    const [usernameInput, setUsernameInput] = useState("");

    if (!session) return (
        <Flex
            h="100vh"
            justify="center"
            align="center"
        >
            <AuthenticationModal />
        </Flex>)


    return (

        <>
            <Modal
                opened={!session.user.name}
                title="Zeig den Leuten, wer du bist"
                onClose={() => null}
                withCloseButton={false}
                centered
                size="sm"
                transitionProps={{ transition: 'fade', duration: 200 }}
            >
                <Flex gap="md" direction="column">

                    <TextInput
                        placeholder=""
                        label="Dein Name"
                        withAsterisk
                        maxLength={30}
                        onChange={(e) => setUsernameInput(e.target.value)}
                    />

                    <Button variant="filled" onClick={() => updateSession({ name: usernameInput })} >
                        Namen speichern
                    </Button>
                </Flex>

            </Modal>

            <AppShell
                styles={{
                    main: {
                        background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                    },
                }}
                navbarOffsetBreakpoint="sm"
                asideOffsetBreakpoint="sm"
                navbar={
                    <Navbar opened={isNavbarOpened} />
                }
                footer={
                    <Footer height={60} p="md">
                        The Genius Software &copy; 2023
                    </Footer>
                }
                header={
                    <Header height={{ base: 50, md: 70 }} p="md">
                        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                                <Burger
                                    opened={isNavbarOpened}
                                    onClick={() => setIsNavbarOpened((o) => !o)}
                                    size="sm"
                                    color={theme.colors.gray[6]}
                                    mr="xl"
                                />
                            </MediaQuery>

                            {session.user.name &&
                                <Text>Schön dich zu sehen, {session.user.name}!</Text>
                            }
                        </div>
                    </Header>
                }
            >
                <Text>{props.children}</Text>

            </AppShell>
        </>

    )
}

export default PageLayout