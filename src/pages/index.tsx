import { AppShell, Burger, Footer, Header, MediaQuery, Text, useMantineTheme } from "@mantine/core";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Navbar from "~/components/Navbar/Navbar";
import LoginPage from "./loginPage";


const Home: NextPage = () => {
  const { data: session } = useSession();

  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  if (!session) return <LoginPage />

  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar opened={opened} />
      }
      footer={
        <Footer height={60} p="md">
          Application footer
        </Footer>
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Text>Application header</Text>
          </div>
        </Header>
      }
    >
      <Text>Resize app to see responsive navbar in action</Text>
    </AppShell>
  );
};

export default Home;
