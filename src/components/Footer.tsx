import { Anchor, AppShell, Group, rem } from "@mantine/core";
import { useRouter } from "next/router";

const links = [
  { link: "/impressum", label: "Impressum" },
  { link: "/datenschutz", label: "Datenschutzerklärung" },
];

const Footer = () => {
  const router = useRouter();

  const items = links.map((link) => (
    <Anchor
      key={link.link}
      color="dimmed"
      onClick={() => void router.push(link.link)}
    >
      {link.label}
    </Anchor>
  ));

  return (
    <AppShell.Footer
      px="md"
      py="xs"
    >
      <Group
        h="100%"
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {items}
      </Group>
    </AppShell.Footer>
  );
};

export default Footer;
