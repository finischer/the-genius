import { Group, Text } from "@mantine/core";
import Link from "next/link";
import React from "react";

const LegalLinks = () => {
  return (
    <Group>
      <Link href="/impressum">
        <Text
          c="dimmed"
          fz="xs"
        >
          Impressum
        </Text>
      </Link>

      <Link href="/datenschutz">
        <Text
          c="dimmed"
          fz="xs"
        >
          Datenschutz
        </Text>
      </Link>
    </Group>
  );
};

export default LegalLinks;
