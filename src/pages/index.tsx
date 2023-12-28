import { Box, Button, Flex, Group, Paper, Text, UnstyledButton, rem, useMantineTheme } from "@mantine/core";
import { IconCategory, IconSearch, IconUser } from "@tabler/icons-react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import PageLayout from "~/components/layout";
import Card from "~/components/shared/Card/Card";
import NextHead from "~/components/shared/NextHead";

// TODO: Create Home page

const Home: NextPage = () => {
  const { push: goTo } = useRouter();

  const theme = useMantineTheme();

  return (
    <>
      <NextHead title="Startseite" />
      <PageLayout>
        <Flex
          gap="xl"
          align="flex-start"
        >
          <Card
            title="Suchen"
            Icon={IconSearch}
            subTitle="Räume suchen"
            onClick={() => void goTo("/rooms")}
          />
          <Card
            title="Freunde"
            Icon={IconUser}
            subTitle="Hinzufügen und pflegen"
            disabled
            onClick={() => console.log("Move to: Räume suchen")}
          />
          <Card
            title="Spielshows"
            Icon={IconCategory}
            subTitle="Erstellen und Starten"
            onClick={() => void goTo("/gameshows")}
          />
        </Flex>
      </PageLayout>
    </>
  );
};

export default Home;
