import {
  Avatar,
  Box,
  Button,
  Flex,
  Navbar as MantineNavbar,
  Menu,
  NavLink,
  Text,
  UnstyledButton,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { IconChevronLeft, IconChevronRight, IconLogout, IconSettings } from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useNotification from "~/hooks/useNotification";
import { useScreen } from "~/hooks/useScreen";
import { useUser } from "~/hooks/useUser";
import { api } from "~/utils/api";
import { AdminBadge, RoleBadge } from "../shared/Badge/Badge";
import { openPricingModal } from "../shared/modals/modalComponents";
import { navbartabs } from "./navbarTabs";

const User = () => {
  const { isMediumScreen } = useScreen();
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
        <Box
          sx={{
            paddingTop: theme.spacing.sm,
            borderTop: `${rem(1)} solid ${
              theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
            }`,
          }}
        >
          <UnstyledButton
            sx={{
              display: "block",
              overflow: "hidden",
              width: "100%",
              padding: theme.spacing.xs,
              borderRadius: theme.radius.sm,
              color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
              "&:hover": {
                backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
              },
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
              <Box sx={{ flex: 1 }}>
                <Flex
                  align="flex-start"
                  gap="md"
                >
                  <RoleBadge role={user?.role ?? "USER"} />
                  <Text
                    size="sm"
                    weight={500}
                  >
                    {session?.user.name}
                  </Text>
                </Flex>
                <Text
                  color="dimmed"
                  size="xs"
                >
                  {session?.user.email}
                </Text>
              </Box>

              {theme.dir === "ltr" ? <IconChevronRight size={rem(18)} /> : <IconChevronLeft size={rem(18)} />}
            </Flex>
          </UnstyledButton>
        </Box>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Account</Menu.Label>
        <Menu.Item
          icon={<IconSettings size={14} />}
          onClick={() => goTo("/settings")}
        >
          Einstellungen
        </Menu.Item>
        <Menu.Item
          icon={<IconLogout size={14} />}
          onClick={() => void handleLogout()}
        >
          Ausloggen
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

const Navbar = ({ opened }: { opened: boolean }) => {
  const router = useRouter();
  const { isAdmin } = useUser();

  const isActive = (href: string) => {
    if (href === "/") return router.pathname.length === 1;

    return router.pathname.startsWith(href);
  };

  const goTo = (href: string) => {
    void router.push(href, undefined, { shallow: true });
  };

  const normalTabsElements = navbartabs.normal.map((tab) => (
    <NavLink
      key={tab.href}
      {...tab}
      active={isActive(tab.href)}
      onClick={() => goTo(tab.href)}
    />
  ));

  const adminTabsElements = navbartabs.admin.map((tab) => (
    <Box
      pos="relative"
      key={tab.href}
    >
      <Box
        pos="absolute"
        right={-10}
        top={-10}
        sx={{
          rotate: "20deg",
        }}
      >
        <AdminBadge disableTooltip />
      </Box>
      <NavLink
        {...tab}
        active={isActive(tab.href)}
        onClick={() => goTo(tab.href)}
      />
    </Box>
  ));

  return (
    <MantineNavbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 200, lg: 300 }}
    >
      <MantineNavbar.Section grow>
        {/* General Navbar Links */}
        <Flex
          direction="column"
          justify="space-between"
          h="100%"
          pb="md"
        >
          <Flex
            gap="1rem"
            direction="column"
          >
            {normalTabsElements}

            {/* Admin Navbar Links */}
            {isAdmin && adminTabsElements}
          </Flex>

          <Button
            mt="md"
            variant="subtle"
            onClick={() => openPricingModal()}
            disabled
          >
            Premium kaufen 👑
          </Button>
        </Flex>
      </MantineNavbar.Section>

      <MantineNavbar.Section>
        <User />
      </MantineNavbar.Section>
    </MantineNavbar>
  );
};

export default Navbar;
