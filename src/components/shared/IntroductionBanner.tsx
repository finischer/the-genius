import { Flex, Modal, Text } from "@mantine/core";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";

const IntroductionBanner = () => {
  const { data: session, status } = useSession();
  const { data: user, refetch } = api.users.me.useQuery();
  const { mutateAsync: updateFirstVisit } = api.users.updateFirstVisit.useMutation();
  const [showIntroductionBanner, setShowIntroductionBanner] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session.user.username && user && user.isFirstVisit) {
      setShowIntroductionBanner(true);
    }
  }, [user?.isFirstVisit]);

  const handleCloseModalClick = async () => {
    await updateFirstVisit();
    await refetch();
    setShowIntroductionBanner(false);
  };

  return (
    <Modal
      opened={showIntroductionBanner}
      title="Willkommen bei TheGenius"
      onClose={handleCloseModalClick}
      centered
    >
      <Flex
        gap="md"
        direction="column"
      >
        <Text>Herzlich Willkommen zur Beta-Version von TheGenius!</Text>
        <Text>
          Du bist einer der Ersten, der unsere Anwendung testet und wir schätzen deine Teilnahme an diesem
          Programm. Vielen Dank, dass du dazu beiträgst, TheGenius noch besser zu machen!
        </Text>
        <Text>
          Dein Feedback ist uns besonders wichtig. Als Beta-Tester spielst du eine entscheidende Rolle, uns
          dabei zu helfen, Bugs zu finden, Funktionen zu verbessern und die Benutzererfahrung zu optimieren.
          Wir sind gespannt auf deine Meinung!
        </Text>

        <Text>
          Erstelle Spielshows und spiel&apos; sie mit deinen Freunden! In Zukunft werden weitere Features und
          Spiele kommen, jedoch ist es erstmal entscheidend, dass eine von dir erstellte Spielshow mit deinen
          Freunden gespielt werden kann.
        </Text>

        <Text>
          Solltest du Anmerkungen, Verbesserungsvorschläge oder Bugs gefunden haben, kannst du jederzeit den
          Feedback-Button unten rechts benutzen. Alternativ kannst du auch eine Mail an{" "}
          <Text fs="italic">support@the-genius.de</Text>
          schreiben
        </Text>

        <br />
        <Text>Und jetzt Viel Spaß beim Spielen!</Text>
        <br />
        <Text>Herzliche Grüße,</Text>
        <Text>das TheGenius-Team</Text>
      </Flex>
    </Modal>
  );
};

export default IntroductionBanner;
