import React from "react";
import type { IFeedbackFormProps } from "./feedbackForm.types";
import { Button, Flex, Modal, Rating, Text, Textarea, Title } from "@mantine/core";
import { MAX_TEXTAREA_LENGTH } from "~/config/forms";

const FeedbackForm: React.FC<IFeedbackFormProps> = ({ opened, closeForm }) => {
  const handleCloseForm = () => {
    closeForm();
  };

  const sendFeedback = () => {};

  const FormSection = ({ children, title }: { children: React.ReactNode; title?: string }) => {
    return (
      <Flex
        direction="column"
        gap="md"
      >
        {title && <Title order={5}>{title}</Title>}
        {children}
      </Flex>
    );
  };

  return (
    <Modal
      opened={opened}
      onClose={handleCloseForm}
      title="Gib uns dein Feedback!"
    >
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
            <Rating size="xl" />
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
            <Rating size="xl" />
            <Text>Sehr gut</Text>
          </Flex>
        </FormSection>

        <FormSection title="Welche Anmerkungen hast du zu TheGenius?">
          <Textarea
            minRows={10}
            maxLength={MAX_TEXTAREA_LENGTH}
          />
        </FormSection>

        <Button>Feedback senden</Button>
      </Flex>
    </Modal>
  );
};

export default FeedbackForm;
