import React, { useEffect } from "react";
import type { IFeedbackFormProps } from "./feedbackForm.types";
import { Button, Flex, Modal, Rating, Text, Textarea, Title } from "@mantine/core";
import { MAX_TEXTAREA_LENGTH } from "~/config/forms";
import { useForm } from "@mantine/form";
import { api } from "~/utils/api";
import useNotification from "~/hooks/useNotification";
import { browserName } from "react-device-detect";
import { useOs } from "@mantine/hooks";

const FormSection = ({ children, title }: { children: React.ReactNode; title?: string }) => {
  return (
    <Flex
      direction="column"
      gap="md"
    >
      {title && <Title order={6}>{title}</Title>}
      {children}
    </Flex>
  );
};

const FeedbackForm: React.FC<IFeedbackFormProps> = ({ opened, closeForm }) => {
  const form = useForm({
    initialValues: {
      ratingGeneralExperience: 0,
      ratingControlModerator: 0,
      ratingDesign: 0,
      comment: "",
    },
  });

  const { showSuccessNotification, showErrorNotification, handleZodError } = useNotification();
  const os = useOs();

  const { mutate: pushFeedbackToDatabase, isLoading } = api.feedbacks.create.useMutation({
    onSuccess: () => {
      showSuccessNotification({
        message: "Dein Feedback wurde erfolgreich gesendet",
      });
      closeForm();
    },
    onError: (error) => {
      handleZodError(
        error.data?.zodError,
        error.message ?? "Dein Feedback konnte nicht erfolgreich ermittelt werden"
      );
    },
  });

  useEffect(() => {
    form.reset();
  }, [opened]);

  const sendFeedback = form.onSubmit(() => {
    pushFeedbackToDatabase({
      ...form.values,
      browser: browserName,
      os,
    });
  });

  return (
    <Modal
      opened={opened}
      onClose={closeForm}
      title="Gib uns dein Feedback!"
    >
      <form onSubmit={sendFeedback}>
        <Flex
          direction="column"
          gap="xl"
        >
          <FormSection title="Wie würdest du deinen Gesamteindruck von TheGenius beschreiben?">
            <Flex
              gap="md"
              justify="space-between"
              align="center"
            >
              <Text>Sehr schlecht</Text>
              <Rating
                size="xl"
                {...form.getInputProps("ratingGeneralExperience")}
              />
              <Text>Sehr gut</Text>
            </Flex>
          </FormSection>

          <FormSection title="Wie kommst du mit der Steuerung als Moderator zurecht?">
            <Flex
              gap="md"
              justify="space-between"
              align="center"
            >
              <Text>Sehr schlecht</Text>
              <Rating
                size="xl"
                {...form.getInputProps("ratingControlModerator")}
              />
              <Text>Sehr gut</Text>
            </Flex>
          </FormSection>

          <FormSection title="Wie findest du das Design von TheGenius?">
            <Flex
              gap="md"
              justify="space-between"
              align="center"
            >
              <Text>Sehr schlecht</Text>
              <Rating
                size="xl"
                {...form.getInputProps("ratingDesign")}
              />
              <Text>Sehr gut</Text>
            </Flex>
          </FormSection>

          <FormSection title="Welche Anmerkungen hast du zu TheGenius?">
            <Textarea
              required
              minRows={10}
              maxLength={MAX_TEXTAREA_LENGTH}
              {...form.getInputProps("comment")}
            />
            <span>
              {form.getInputProps("comment").value.length} / {MAX_TEXTAREA_LENGTH} Zeichen
            </span>
          </FormSection>

          <Button
            type="submit"
            loading={isLoading}
          >
            Feedback senden
          </Button>
        </Flex>
      </form>
    </Modal>
  );
};

export default FeedbackForm;
