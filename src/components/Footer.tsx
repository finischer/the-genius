import { Anchor, Group, Footer as MantineFooter, rem } from "@mantine/core";
import { useRouter } from "next/router";

const links = [
  { link: "/impressum", label: "Impressum" },
  { link: "#", label: "Datenschutzerklärung" },
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
    <MantineFooter
      height={rem(60)}
      px="md"
      py="xs"
    >
      <Group
        h="100%"
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {items}
      </Group>
    </MantineFooter>
  );
};

export default Footer;