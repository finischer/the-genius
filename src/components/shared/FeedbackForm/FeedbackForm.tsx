import React, { useEffect } from "react";
import type { IFeedbackFormProps } from "./feedbackForm.types";
import { Button, Flex, Modal, Rating, Text, Textarea, Title } from "@mantine/core";
import { MAX_TEXTAREA_LENGTH } from "~/config/forms";
import { useForm } from "@mantine/form";

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
      comment: "",
    },
  });

  useEffect(() => {
    form.reset();
  }, [opened]);

  const sendFeedback = () => {
    console.log("Send Feedback!", form.values);

    // closeForm()
  };

  return (
    <Modal
      opened={opened}
      onClose={closeForm}
      title="Gib uns dein Feedback!"
    >
      <form>
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

          <FormSection title="Welche Anmerkungen hast du zu TheGenius?">
            <Textarea
              required
              minRows={10}
              maxLength={MAX_TEXTAREA_LENGTH}
              {...form.getInputProps("comment")}
            />
          </FormSection>

          <Button onClick={sendFeedback}>Feedback senden</Button>
        </Flex>
      </form>
    </Modal>
  );
};

export default FeedbackForm;
