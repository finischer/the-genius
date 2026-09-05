import {
  Button,
  Modal,
  SegmentedControl,
  Stack,
  Text,
  Textarea,
  TextInput,
  type SegmentedControlItem
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { GameshowDifficulty } from "~/generated/prisma/enums";
import React, { useEffect, type FC } from "react";
import { TheGeniusConfig } from "~/config/the-genius";
import useNotification from "~/hooks/useNotification";
import type { SafedGameshow } from "~/server/api/routers/gameshows";
import { api } from "~/utils/api";

interface IPublishGameshowModalProps {
  openedModal: boolean;
  onClose: () => void;
  gameshow: SafedGameshow;
}

interface IPublishGameshowConfig {
  name: string;
  description: string;
  difficultyLevel: GameshowDifficulty;
}

const MIN_LENGTH_NAME = 6;
const MAX_LENGTH_NAME = 100;
const MIN_LENGTH_DESCRIPTION = 20;
const MAX_LENGTH_DESCRIPTION = 200;

const DEFAULT_LEVEL = GameshowDifficulty.MEDIUM;

const DIFFICULTY_LEVELS: SegmentedControlItem[] = Object.entries(
  TheGeniusConfig.gameshow.difficultLevels
).map(([value, { name }]) => ({
  value,
  label: name
}));

const PublishGameshowModal: FC<IPublishGameshowModalProps> = ({
  openedModal,
  onClose,
  gameshow
}) => {
  const { showSuccessNotification, handleZodError } = useNotification();
  const { mutateAsync: publishGameshow, isLoading } =
    api.gameshows.publishGameshow.useMutation({
      onError: (error) => {
        handleZodError(
          error.data?.zodError,
          error.message ?? "Ein Fehler ist aufgetreten"
        );
      },
      onSuccess: () => {
        showSuccessNotification({
          title: "Spielshow veröffentlicht",
          message: "Die Spielshow wurde erfolgreich veröffentlicht."
        });
        onClose();
      }
    });

  const form = useForm<IPublishGameshowConfig>({
    initialValues: {
      name: gameshow.name,
      description: "",
      difficultyLevel: DEFAULT_LEVEL
    },
    validate: {
      name: (value) =>
        value.length < MIN_LENGTH_NAME
          ? `Der Name muss mindestens ${MIN_LENGTH_NAME} Zeichen lang sein.`
          : value.length > MAX_LENGTH_NAME
            ? `Der Name darf maximal ${MAX_LENGTH_NAME} Zeichen lang sein.`
            : null,
      description: (value) =>
        value.length < MIN_LENGTH_DESCRIPTION
          ? `Die Beschreibung muss mindestens ${MIN_LENGTH_DESCRIPTION} Zeichen lang sein.`
          : value.length > MAX_LENGTH_DESCRIPTION
            ? `Die Beschreibung darf maximal ${MAX_LENGTH_DESCRIPTION} Zeichen lang sein.`
            : null
    }
  });

  const handlePublishGameshow = form.onSubmit(async (values) => {
    await publishGameshow({
      gameshowId: gameshow.id,
      name: values.name,
      description: values.description,
      difficultyLevel: values.difficultyLevel
    });
  });

  useEffect(() => {
    // reset form when modal was opened
    form.reset();
  }, [openedModal]);

  return (
    <Modal
      title="Spielshow veröffentlichen"
      onClose={onClose}
      opened={openedModal}
    >
      <form onSubmit={handlePublishGameshow}>
        <Stack gap="lg">
          <TextInput
            withAsterisk
            label="Name der Spielshow"
            placeholder="Meine Spielshow #1"
            key={form.key("name")}
            {...form.getInputProps("name")}
          />
          <Textarea
            withAsterisk
            label="Beschreibung"
            placeholder="Das ist eine Spielshow für jeden!"
            key={form.key("description")}
            rows={3}
            {...form.getInputProps("description")}
          />
          <Stack gap="xs">
            <Text size="sm">Schwierigkeitsgrad</Text>
            <SegmentedControl
              orientation="vertical"
              // onChange={handleDifficultyLevelChange}
              fullWidth
              data={DIFFICULTY_LEVELS}
              {...form.getInputProps("difficultyLevel")}
            />
            <Text size="xs" c="dimmed">
              {
                TheGeniusConfig.gameshow.difficultLevels[
                  form.values.difficultyLevel
                ].description
              }
            </Text>
          </Stack>
          <Button type="submit" loading={isLoading}>
            Veröffentlichen
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};

export default PublishGameshowModal;
