import { Button, Group, Paper, Text } from "@mantine/core";
import { CookieBannerAction } from "./analytics/GoogleAnalytics";

interface ICookieBannerProps {
  onButtonClick: (action: CookieBannerAction) => void;
}

const CookieBanner: React.FC<ICookieBannerProps> = ({ onButtonClick }) => {
  return (
    <Paper
      withBorder
      p="lg"
      radius="md"
      shadow="md"
      pos="absolute"
      bottom={0}
      w="100%"
      style={{
        zIndex: 9999,
      }}
    >
      <Group
        mb="xs"
        style={{
          justify: "space-between",
        }}
      >
        <Text
          fz="md"
          fw={500}
        >
          Wir nutzen Cookies
        </Text>
      </Group>
      <Text
        c="dimmed"
        fz="xs"
      >
        Wir verwenden analytische Cookies und einige Cookies werden von Drittanbietern platziert, die auf
        unseren Seiten erscheinen. Durch Klicken auf &quot;Alle akzeptieren&quot; stimmen Sie der Verwendung
        aller Cookies für Ihre jeweilige Session zu.
      </Text>
      <Group
        style={{
          justify: "flex-end",
        }}
        mt="md"
      >
        <Button
          variant="default"
          size="xs"
          onClick={() => onButtonClick(CookieBannerAction.DECLINE)}
        >
          Nur notwendige Cookies
        </Button>
        <Button
          variant="filled"
          size="xs"
          onClick={() => onButtonClick(CookieBannerAction.ACCEPT)}
        >
          Alle akzeptieren
        </Button>
      </Group>
    </Paper>
  );
};

export default CookieBanner;
