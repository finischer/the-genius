import { Box, Flex, Group } from "@mantine/core";
import { IconCategory, IconSearch, IconUsers } from "@tabler/icons-react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import InfoSection from "~/compositions/home/InfoSection/InfoSection";
import Card from "~/components/Card/Card";
import NextHead from "~/compositions/NextHead";
import IntroductionBanner from "~/compositions/IntroductionBanner";
import PageLayout from "~/compositions/layout/PageLayout";

const Home: NextPage = () => {
  const { push: goTo } = useRouter();

  return (
    <>
      <NextHead title="Startseite" />
      <IntroductionBanner />
      <PageLayout>
        <Flex
          gap="xl"
          align="flex-start"
          justify="space-between"
          h="100%"
          w="100%"
        >
          <Group align="flex-start">
            <Card
              title="Suchen"
              Icon={IconSearch}
              subTitle="Räume suchen"
              onClick={() => void goTo("/rooms")}
            />
            <Card
              title="Freunde"
              Icon={IconUsers}
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
          </Group>
          <Box h="100%">
            <InfoSection />
          </Box>
        </Flex>
      </PageLayout>
    </>
  );
};

export default Home;
