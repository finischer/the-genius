import { Box, Flex, Group } from "@mantine/core";
import { IconCategory, IconSearch, IconUsers } from "@tabler/icons-react";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import InfoSection from "~/components/home/InfoSection/InfoSection";
import PageLayout from "~/components/layout/PageLayout";
import NewReleaseModal from "~/components/release-notes/NewReleaseModal";
import Card from "~/components/shared/Card/Card";
import IntroductionBanner from "~/components/shared/IntroductionBanner";
import NextHead from "~/components/shared/NextHead";
import { api } from "~/utils/api";
import { shouldShowModal } from "~/utils/semver";

const Home: NextPage = () => {
  const { push: goTo } = useRouter();
  const { status } = useSession();

  const [releaseModalOpened, setReleaseModalOpened] = useState(false);

  /**
   * Guard, damit die First-Visit-Logik (Req. 4.5) nur ein einziges Mal
   * innerhalb des Component-Lifecycles ausgeführt wird. Ohne diesen Guard
   * würde der `useEffect` nach dem `markAsSeen`-Call – falls die Queries
   * neu geladen werden – erneut `markAsSeen` auslösen.
   */
  const firstVisitHandledRef = useRef(false);

  const latestReleaseQuery = api.releaseNotes.getLatest.useQuery(undefined, {
    enabled: status === "authenticated"
  });
  const seenVersionQuery = api.releaseNotes.getSeenVersion.useQuery(undefined, {
    enabled: status === "authenticated"
  });
  const markAsSeenMutation = api.releaseNotes.markAsSeen.useMutation();

  /**
   * Entscheidet nach dem Laden der Session und der Release-Notes-Queries,
   * ob das `<NewReleaseModal>` angezeigt werden soll (Req. 4.1) oder ob es
   * sich um einen First-Visit handelt (Req. 4.5).
   *
   * Bei ungefährlichen Fehlern in den Queries (isError, kein Release Note
   * vorhanden usw.) passiert bewusst nichts – das Modal bleibt geschlossen
   * und die App bleibt voll funktional (Req. 6.5).
   */
  useEffect(() => {
    if (status !== "authenticated") return;
    if (!latestReleaseQuery.isSuccess) return;
    if (!seenVersionQuery.isSuccess) return;

    const latest = latestReleaseQuery.data;
    const seenVersion = seenVersionQuery.data;

    // Keine Release Notes vorhanden → nichts zu tun.
    if (latest === null) return;

    // First-Visit-Fall: aktuelle Version stillschweigend als "gesehen"
    // markieren, ohne das Modal anzuzeigen (Req. 4.5).
    if (seenVersion === null) {
      if (firstVisitHandledRef.current) return;
      firstVisitHandledRef.current = true;
      markAsSeenMutation.mutate({ version: latest.version });
      return;
    }

    if (shouldShowModal(latest.version, seenVersion)) {
      setReleaseModalOpened(true);
    }
  }, [
    status,
    latestReleaseQuery.isSuccess,
    latestReleaseQuery.data,
    seenVersionQuery.isSuccess,
    seenVersionQuery.data
  ]);

  const latestReleaseNote = latestReleaseQuery.data;

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
      {latestReleaseNote && (
        <NewReleaseModal
          opened={releaseModalOpened}
          onClose={() => setReleaseModalOpened(false)}
          releaseNote={latestReleaseNote}
        />
      )}
    </>
  );
};

export default Home;
