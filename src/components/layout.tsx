import { AppShell, Burger, Button, Flex, Footer, Header, MediaQuery, Modal, Text, TextInput, useMantineTheme } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Loader from './shared/Loader';
import Navbar from './Navbar';
import AuthenticationModal from './shared/modals/AuthenticationModal';
import useLoadingState from '~/hooks/useLoadingState/useLoadingState';

interface IPageLayout {
    showLoader?: boolean
    loadingMessage?: string
    children?: React.ReactNode
}


const PageLayout: React.FC<IPageLayout> = ({ showLoader = false, loadingMessage = "Lädt ...", children }) => {
    const { data: session, update: updateSession, status } = useSession();
    const { pageIsLoading } = useLoadingState()
    const theme = useMantineTheme();
    const [isNavbarOpened, setIsNavbarOpened] = useState(false)
    const [usernameInput, setUsernameInput] = useState("");

    useEffect(() => {
        console.log("Sesion: ", session)
    }, [session])

    const updateUser = async () => {
        const newUser = { ...session, user: { ...session?.user, username: usernameInput } }
        console.log("New user: ", newUser)
        const res = await updateSession(newUser)
        console.log("Result: ", res)
    }

    if (status === "unauthenticated") {
        return (
            <Flex
                h="100vh"
                justify="center"
                align="center"
            >
                <AuthenticationModal />
            </Flex>
        )
    }

    if (status === "authenticated") {
        return (

            <>
                <Modal
                    opened={!session.user.username}
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
                            label="Dein Username"
                            withAsterisk
                            maxLength={30}
                            onChange={(e) => setUsernameInput(e.target.value)}
                        />

                        <Button variant="filled" onClick={updateUser} >
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

                                {session.user.username &&
                                    <Text>Schön dich zu sehen, {session.user.username}!</Text>
                                }
                            </div>
                        </Header>
                    }
                >
                    {showLoader && <Loader message={loadingMessage} />}
                    {pageIsLoading && <Loader message="Lädt" />}
                    {!showLoader && !pageIsLoading && <Text>{children}</Text>}
                </AppShell>
            </>

        )
    }

    return <></>
}

export default PageLayout