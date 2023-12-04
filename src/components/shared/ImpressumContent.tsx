import { Flex, Text, Title } from "@mantine/core";
import Link from "next/link";
import React from "react";
import Section from "./Section";

const ImpressumContent = () => {
  return (
    <>
      {/* Owner Section */}
      <Section>
        <Title>Impressum</Title>
        <Text>Niklas Fischer</Text>
        <Text>Hauptstraße 13</Text>
        <Text>65812 Bad Soden am Taunus</Text>
        <Text>Deutschland</Text>
      </Section>

      {/* Contact Section */}
      <Section>
        <Title order={2}>Kontaktmöglichkeiten</Title>
        <Text>E-Mail-Adresse: </Text>
        <Text>suport@the-genius.de</Text>
      </Section>

      {/* UmSt-ID Section */}
      <Section>
        <Title order={2}>Angaben zum Unternehmen</Title>
        <Text>Umsatzsteuer Identifikationsnummer (USt-ID):</Text>
        <Text>DE359815850</Text>
      </Section>

      {/* Online-Streitbeilegung Section */}
      <Section>
        <Title order={2}>Online-Streitbeilegung (OS)</Title>
        <Text>
          Online-Streitbeilegung: Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung
          (OS) bereit, die Sie unter{" "}
          <Link href="https://ec.europa.eu/consumers/odr/">https://ec.europa.eu/consumers/odr/</Link> finden.
          Verbraucher haben die Möglichkeit, diese Plattform für die Beilegung ihrer Streitigkeiten zu nutzen.
        </Text>
      </Section>
    </>
  );
};

export default ImpressumContent;
