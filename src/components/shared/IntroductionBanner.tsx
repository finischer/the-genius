import { Checkbox, Divider, Flex, Modal, ScrollArea, Stack, Text } from "@mantine/core";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";

const IntroductionBanner = () => {
  const { data: session, status } = useSession();
  const { data: user, refetch } = api.users.me.useQuery();
  const { mutateAsync: updateFirstVisit } = api.users.updateFirstVisit.useMutation();
  const [showIntroductionBanner, setShowIntroductionBanner] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session.user.username && user && user.isFirstVisit) {
      setShowIntroductionBanner(true);
    }
  }, [user?.isFirstVisit]);

  const handleCloseModalClick = async () => {
    if (checkboxChecked) {
      await updateFirstVisit();
      await refetch();
    }

    setShowIntroductionBanner(false);
  };

  return (
    <Modal
      opened={showIntroductionBanner}
      onClose={handleCloseModalClick}
      size="lg"
      centered
      title={<Text>Herzlich Willkommen bei TheGenius!</Text>}
    >
      <Stack gap="md">
        <Text>
          &quot;TheGenius&quot; ist deine Eintrittskarte in eine Welt voller Wissen, Spannung und Spaß. Wir
          bieten eine Vielzahl von Spielmodi und Herausforderungen, die deine mentalen Fähigkeiten auf die
          Probe stellen und deine kreative Seite zum Vorschein bringen. Ob du ein Trivia-Genie bist, ein
          Meister des Wortspiels oder ein Stratege in strategischen Denkspielen – &quot;TheGenius&quot; hat
          für jeden etwas zu bieten. Fordere deine Freunde heraus und erstelle deine eigene
          &quot;TheGenius&quot;-Show (BrainBattle), in der du als Moderator agierst und die Herausforderungen
          für deine Freunde erstellst. Nutze unsere benutzerfreundliche Plattform, um eine maßgeschneiderte
          Show zu erstellen und sie mit deinen Freunden zu teilen. Wer wird der ultimative Champion sein?
          Unser intuitives Interface macht es einfach, in das Spiel einzutauchen, und unsere regelmäßig
          aktualisierten Inhalte sorgen dafür, dass dir nie langweilig wird. Tauche ein in ein Universum
          voller Rätsel, Quizfragen, Denksportaufgaben und vielem mehr. Bist du bereit, deine geistige
          Überlegenheit zu beweisen und dich zum ultimativen &quot;Genius&quot; zu krönen? Dann trete ein und
          lass das Spiel beginnen!
        </Text>

        <Text>
          Solltest du Anmerkungen, Verbesserungsvorschläge oder Bugs gefunden haben, kannst du jederzeit
          Feedback einreichen. Über den Reiter &quot;Feedback&quot; in der linken Navigationsleiste, gelangst
          du zum Feedback-Formular. Alternativ kannst du auch eine Mail an{" "}
          <Text fs="italic">support@the-genius.de</Text>
          schreiben
        </Text>

        <br />
        <Text>Und jetzt Viel Spaß beim Spielen!</Text>
        <br />
        <Text>Herzliche Grüße,</Text>
        <Text>dein TheGenius-Team</Text>

        <Divider />
        <Checkbox
          label="Hinweis nicht mehr anzeigen"
          checked={checkboxChecked}
          onChange={(event) => setCheckboxChecked(event.currentTarget.checked)}
        />
      </Stack>
    </Modal>
  );
};

export default IntroductionBanner;
