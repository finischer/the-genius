import React from 'react'
import { AppShell, Aside, Burger, Footer, Group, Header, MediaQuery, Navbar as MantineNavbar, Text, ThemeIcon, UnstyledButton, useMantineTheme } from "@mantine/core";
import { useState } from "react";
import { IconDashboard } from '@tabler/icons-react';

const Navbar = ({ opened }: { opened: boolean }) => {
    return (
        <MantineNavbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
            <MantineNavbar.Section>
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
                        <ThemeIcon color="blue" variant="light">
                            <IconDashboard size="1rem" />
                        </ThemeIcon>

                        <Text size="sm">Dashboard</Text>
                    </Group>
                </UnstyledButton>

            </MantineNavbar.Section>
        </MantineNavbar>
    )
}

export default Navbar