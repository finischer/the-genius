import { Badge, Button, Card, Group, Text } from "@mantine/core";
import { type FC } from "react";
import { api } from "~/utils/api";
import classes from "./gameshowCard.module.css";
import type { IGameshowCardProps } from "./gameshowCard.types";
import { useUser } from "~/hooks/useUser";
import useNotification from "~/hooks/useNotification";
import type { Game } from "@prisma/client";

export const GameshowCard: FC<IGameshowCardProps> = ({
  id,
  gameshow,
  alreadyImported
}) => {
  const { showSuccessNotification } = useNotification();
  const { user } = useUser();
  const { name, description, games, user: creator } = gameshow;
  const {
    mutateAsync: importGameshow,
    isLoading: gameshowWillBeImported,
    isSuccess: gameshowWasImported
  } = api.gameshows.importGameshow.useMutation({
    onSuccess: () => {
      showSuccessNotification({
        title: "Spielshow importiert",
        message: "Die Spielshow wurde erfolgreich importiert."
      });
    }
  });

  const disableImportButton = gameshowWasImported || alreadyImported;

  const badges = games.map((game: Game) => ({
    label: game.name
  }));

  const features = badges.map((badge) => (
    <Badge variant="light" key={badge.label}>
      {badge.label}
    </Badge>
  ));

  const handleImportGameshow = async () => {
    await importGameshow({
      gameshowId: id
    });
  };

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      {/* <Card.Section>
        <Image src={image} alt={title} height={180} />
      </Card.Section> */}

      <Card.Section className={classes.section} p="md">
        <Group justify="apart">
          <Text fz="lg" fw={500}>
            {name}
          </Text>
          <Badge size="sm" variant="light">
            {creator.username}
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

      {creator.id !== user?.id && (
        <Group mt="xs">
          <Button
            radius="md"
            style={{ flex: 1 }}
            onClick={handleImportGameshow}
            disabled={disableImportButton || gameshowWillBeImported}
            loading={gameshowWillBeImported}
          >
            {disableImportButton ? "Bereits importiert" : "Importieren"}
          </Button>
          {/* <ActionIcon variant="default" radius="md" size={36}>
          <IconHeart className={classes.like} stroke={1.5} />
          </ActionIcon> */}
        </Group>
      )}
    </Card>
  );
};
