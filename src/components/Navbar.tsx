import React from 'react'
import { AppShell, Aside, Burger, Footer, Group, Header, MediaQuery, Navbar as MantineNavbar, Text, ThemeIcon, UnstyledButton, useMantineTheme, ThemeIconProps, MantineColor } from "@mantine/core";
import { useState } from "react";
import { IconDashboard } from '@tabler/icons-react';
import Link from 'next/link';
import { IconDoor } from '@tabler/icons-react';

interface INavbarLinkButton {
    icon: JSX.Element
    iconColor: MantineColor
    href: string
    children: React.ReactNode
}

const NavbarLinkButton: React.FC<INavbarLinkButton> = ({ icon, iconColor, href, children }) => {
    return (
        <Link href={href} >
            <UnstyledButton
                sx={(theme) => ({
                    display: 'block',
                    width: '100%',
                    padding: theme.spacing.xs,
                    borderRadius: theme.radius.sm,
                    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

                    '&:hover': {
                        backgroundColor:
                            theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                    },
                })}
            >

                <Group>

                    <ThemeIcon color={iconColor} variant="light">
                        {icon}
                    </ThemeIcon>

                    <Text size="sm">{children}</Text>
                </Group>
            </UnstyledButton>
        </Link>
    )
}

const Navbar = ({ opened }: { opened: boolean }) => {
    return (
        <MantineNavbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
            <MantineNavbar.Section>
                <NavbarLinkButton
                    icon={<IconDoor size="1rem" />}
                    iconColor='blue'
                    href='/rooms'
                >
                    Raum beitreten
                </NavbarLinkButton>
            </MantineNavbar.Section>
        </MantineNavbar>
    )
}

export default Navbar