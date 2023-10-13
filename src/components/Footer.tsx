import React from "react";
import { Anchor, Group, ActionIcon, rem, Footer as MantineFooter, Flex } from "@mantine/core";
import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram } from "@tabler/icons-react";
import { useRouter } from "next/router";

const links = [
  { link: "/impressum", label: "Impressum" },
  { link: "#", label: "Datenschutzerklärung" },
];

const Footer = () => {
  const router = useRouter();

  const items = links.map((link) => (
    <Anchor
      c="dimmed"
      key={link.label}
      lh={1}
      onClick={() => void router.push(link.link)}
      size="sm"
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
