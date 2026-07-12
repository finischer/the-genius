import { Group, Text } from "@mantine/core";
import Link from "next/link";

const LegalLinks = () => {
  return (
    <Group>
      <Link href="/impressum">
        <Text c="dimmed" fz="xs">
          Impressum
        </Text>
      </Link>

      <Link href="/datenschutz">
        <Text c="dimmed" fz="xs">
          Datenschutz
        </Text>
      </Link>

      <Link href="/release-notes">
        <Text c="dimmed" fz="xs">
          Release Notes
        </Text>
      </Link>
    </Group>
  );
};

export default LegalLinks;
