import { AppShell, Box, Flex, Group, NavLink, Stack, Text } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import pack from "package.json";
import { useUser } from "~/hooks/useUser";
import { AdminBadge } from "../shared/Badge/Badge";
import UserCard from "../shared/UserCard/UserCard";
import { navbartabs } from "./navbarTabs";
import LegalLinks from "../shared/LegalLinks";

const Navbar = () => {
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
      component={Link}
      {...tab}
      active={isActive(tab.href)}
      onClick={() => goTo(tab.href)}
      style={(theme) => ({
        borderRadius: theme.radius.xs,
      })}
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
        style={{
          rotate: "20deg",
        }}
      >
        <AdminBadge disableTooltip />
      </Box>
      <NavLink
        {...tab}
        component={Link}
        active={isActive(tab.href)}
        onClick={() => goTo(tab.href)}
        style={(theme) => ({
          borderRadius: theme.radius.xs,
        })}
      />
    </Box>
  ));

  return (
    <AppShell.Navbar p="sm">
      <AppShell.Section grow>
        {/* General Navbar Links */}
        <Flex
          direction="column"
          justify="space-between"
          h="100%"
          pb="md"
        >
          <Flex
            gap="sm"
            direction="column"
          >
            {normalTabsElements}

            {/* Admin Navbar Links */}
            {isAdmin && adminTabsElements}
          </Flex>

          <Stack
            align="center"
            gap="xs"
            // bg="green"
          >
            <Text
              c="dimmed"
              fz="xs"
            >
              The Genius Beta v{pack.version}
            </Text>

            <LegalLinks />

            {/* <Button
              fullWidth
              mt="md"
              variant="subtle"
              onClick={() => openPricingModal()}
              disabled
            >
              Premium kaufen 👑
            </Button> */}
          </Stack>
        </Flex>
      </AppShell.Section>

      <AppShell.Section>
        <UserCard />
      </AppShell.Section>
    </AppShell.Navbar>
  );
};

export default Navbar;
