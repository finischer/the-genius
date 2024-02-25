import { Box, Flex, Text, UnstyledButton } from "@mantine/core";
import { Avatar } from "@mantine/core";
import { Menu, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import useNotification from "~/hooks/useNotification";
import { api } from "~/utils/api";
import { RoleBadge } from "../Badge/Badge";
import { IconChevronRight, IconLogout, IconSettings } from "@tabler/icons-react";
import classes from "./userCard.module.css";

const UserCard = () => {
  const { colorScheme } = useMantineColorScheme();
  const { showSuccessNotification } = useNotification();
  const { data: session } = useSession();
  const theme = useMantineTheme();
  const router = useRouter();

  const { data: user } = api.users.me.useQuery();

  const handleLogout = async () => {
    const data = await signOut({ redirect: false, callbackUrl: "/" });
    void router.push(data.url);
    showSuccessNotification({
      title: "Logout erfolgreich",
      message: "Ich hoffe, wir sehen uns bald wieder 👋",
    });
  };

  const goTo = (subUrl: string) => {
    void router.push(subUrl);
  };

  return (
    <Menu
      shadow="md"
      width={200}
    >
      <Menu.Target>
        <Box className={classes.userCard}>
          <UnstyledButton
            style={{
              display: "block",
              overflow: "hidden",
              width: "100%",
              padding: theme.spacing.xs,
              borderRadius: theme.radius.sm,
              color: colorScheme === "dark" ? theme.white : theme.black,
            }}
          >
            <Flex
              gap="md"
              align="center"
            >
              <Avatar
                src={session?.user.image}
                radius="xl"
              />
              <Box style={{ flex: 1 }}>
                <Flex
                  align="flex-start"
                  gap="md"
                >
                  <RoleBadge role={user?.role ?? "USER"} />
                  <Text
                    size="sm"
                    fw={500}
                  >
                    {session?.user.name}
                  </Text>
                </Flex>
                <Text
                  c="dimmed"
                  size="xs"
                >
                  {session?.user.email}
                </Text>
              </Box>

              <IconChevronRight />
            </Flex>
          </UnstyledButton>
        </Box>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Account</Menu.Label>
        <Menu.Item
          leftSection={<IconSettings size={14} />}
          onClick={() => goTo("/settings")}
        >
          Einstellungen
        </Menu.Item>
        <Menu.Item
          leftSection={<IconLogout size={14} />}
          onClick={() => void handleLogout()}
        >
          Ausloggen
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserCard;
