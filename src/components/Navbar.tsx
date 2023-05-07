import { Avatar, Box, Group, Navbar as MantineNavbar, NavLink, Text, UnstyledButton, rem, useMantineTheme } from "@mantine/core";
import { IconChevronLeft, IconChevronRight, IconDoor, IconTools } from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useNotification from "~/hooks/useNotification";

const User = () => {
    const { showSuccessNotification } = useNotification()
    const { data: session } = useSession();
    const theme = useMantineTheme();
    const router = useRouter()

    const handleLogout = async () => {
        const data = await signOut({ redirect: false, callbackUrl: "/" })
        void router.push(data.url)
        showSuccessNotification({
            title: "Logout erfgolreich",
            message: "Ich hoffe, wir sehen uns bald wieder 👋"
        })
    }

    return (
        <Box
            onClick={() => void handleLogout()}
            sx={{
                paddingTop: theme.spacing.sm,
                borderTop: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
                    }`,
            }}
        >
            <UnstyledButton
                sx={{
                    display: 'block',
                    width: '100%',
                    padding: theme.spacing.xs,
                    borderRadius: theme.radius.sm,
                    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

                    '&:hover': {
                        backgroundColor:
                            theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                    },
                }}
            >
                <Group>
                    <Avatar
                        src={session?.user.image}
                        radius="xl"
                    />
                    <Box sx={{ flex: 1 }}>
                        <Text size="sm" weight={500}>
                            {session?.user.name}
                        </Text>
                        <Text color="dimmed" size="xs">
                            {session?.user.email}
                        </Text>
                    </Box>

                    {theme.dir === 'ltr' ? (
                        <IconChevronRight size={rem(18)} />
                    ) : (
                        <IconChevronLeft size={rem(18)} />
                    )}
                </Group>
            </UnstyledButton>
        </Box>)
}

const Navbar = ({ opened }: { opened: boolean }) => {
    const router = useRouter()

    const isActive = (href: string) => {
        return router.pathname.startsWith(href)
    }

    return (
        <MantineNavbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
            <MantineNavbar.Section grow style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
                <NavLink
                    component="a"
                    active={isActive("/rooms")}
                    href="/rooms"
                    label="Raum beitreten"
                    description=""
                    rightSection=""
                    icon={<IconDoor size="1.3rem" />}

                />
                <NavLink
                    component="a"
                    active={isActive("/gameshows")}
                    href="/gameshows/create"
                    label="Spielshow erstellen"
                    description="Erstelle deine eigene Spielshow"
                    rightSection=""
                    icon={<IconTools size="1.3rem" />}
                />
            </MantineNavbar.Section>

            <MantineNavbar.Section>
                <User />
            </MantineNavbar.Section>
        </MantineNavbar>
    )
}

export default Navbar