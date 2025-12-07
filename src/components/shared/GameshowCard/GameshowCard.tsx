import { Badge, Button, Card, Group, Stack, Text } from "@mantine/core";
import type { Game } from "@prisma/client";
import { type FC } from "react";
import useNotification from "~/hooks/useNotification";
import { useUser } from "~/hooks/useUser";
import { api } from "~/utils/api";
import { getDifficultLevel } from "~/utils/helpers";
import Tooltip from "../Tooltip";
import classes from "./gameshowCard.module.css";
import type { IGameshowCardProps } from "./gameshowCard.types";

export const GameshowCard: FC<IGameshowCardProps> = ({
  id,
  gameshow,
  alreadyImported
}) => {
  const { showSuccessNotification, handleZodError } = useNotification();
  const { user } = useUser();
  const { name, description, games, user: creator } = gameshow;
  const difficulty = getDifficultLevel(gameshow.difficulty);
  const {
    mutateAsync: importGameshow,
    isLoading: gameshowWillBeImported,
    isSuccess: gameshowWasImported
  } = api.gameshows.importGameshow.useMutation({
    onError: (error) => {
      handleZodError(
        error.data?.zodError,
        error.message ?? "Ein Fehler ist aufgetreten"
      );
    },
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
    try {
      await importGameshow({
        gameshowId: id
      });
    } catch {
      return;
    }
  };

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      {/* <Card.Section>
        <Image src={image} alt={title} height={180} />
      </Card.Section> */}

      <Card.Section className={classes.section} p="md">
        <Stack gap={0}>
          <Stack gap="xs">
            <Tooltip label="Schwierigkeitsgrad">
              <Badge size="sm" variant="light">
                {difficulty.name}
              </Badge>
            </Tooltip>
            <Text fz="lg" fw={500}>
              {name}
            </Text>
          </Stack>

          <Text fz="xs" c="dimmed">
            Erstellt von {creator.username}
          </Text>
        </Stack>
        <Text fz="sm" mt="md">
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
