import { Anchor, AppShell, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";

const links = [
  { link: "/impressum", label: "Impressum" },
  { link: "/datenschutz", label: "Datenschutzerklärung" },
  { link: "/release-notes", label: "Release Notes" }
];

const Footer = () => {
  const router = useRouter();

  const handleNavigate = async (link: string) => {
    try {
      await router.push(link);
    } catch {
      notifications.show({
        title: "Fehler",
        message: "Navigation fehlgeschlagen",
        color: "red"
      });
    }
  };

  const items = links.map((link) => (
    <Anchor
      key={link.link}
      color="dimmed"
      onClick={() => void handleNavigate(link.link)}
    >
      {link.label}
    </Anchor>
  ));

  return (
    <AppShell.Footer px="md" py="xs">
      <Group
        h="100%"
        style={{
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {items}
      </Group>
    </AppShell.Footer>
  );
};

export default Footer;
