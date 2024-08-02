import { Badge, Button, Card, Group, Text } from "@mantine/core";
import type { FC } from "react";
import classes from "./gameshowCard.module.css";
import type { IGameshowCardProps } from "./gameshowCard.types";

export const GameshowCard: FC<IGameshowCardProps> = ({
  id,
  title,
  description,
  creator,
  badges
}) => {
  const features = badges.map((badge) => (
    <Badge variant="light" key={badge.label}>
      {badge.label}
    </Badge>
  ));

  const handleImportGameshow = () => {
    console.log("Importing gameshow with id", id);
  };

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      {/* <Card.Section>
        <Image src={image} alt={title} height={180} />
      </Card.Section> */}

      <Card.Section className={classes.section} p="md">
        <Text fz="xs" c="dimmed">
          Gameshow ID: {id}
        </Text>
        <Group justify="apart">
          <Text fz="lg" fw={500}>
            {title}
          </Text>
          <Badge size="sm" variant="light">
            {creator}
          </Badge>
        </Group>
        <Text fz="sm" mt="xs">
          {description}
        </Text>
      </Card.Section>

      <Card.Section className={classes.section}>
        <Text mt="md" className={classes.label} c="dimmed">
          Spiele in dieser Show
        </Text>
        <Group gap={7} mt={5}>
          {features}
        </Group>
      </Card.Section>

      <Group mt="xs">
        <Button radius="md" style={{ flex: 1 }} onClick={handleImportGameshow}>
          Show importieren
        </Button>
        {/* <ActionIcon variant="default" radius="md" size={36}>
          <IconHeart className={classes.like} stroke={1.5} />
        </ActionIcon> */}
      </Group>
    </Card>
  );
};
