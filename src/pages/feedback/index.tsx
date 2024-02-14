import { Button, Center, Divider, Flex, Rating, Text, Textarea, Title, rem } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useOs } from "@mantine/hooks";
import React from "react";
import { browserName } from "react-device-detect";
import PageLayout from "~/components/layout/PageLayout";
import { MAX_TEXTAREA_LENGTH } from "~/config/forms";
import useNotification from "~/hooks/useNotification";
import { api } from "~/utils/api";

interface IFeedbackFormValues {
  ratingGeneralExperience: number;
  ratingControlModerator: number;
  ratingDesign: number;
  comment: string;
}

const FormSection = ({ children, title }: { children: React.ReactNode; title?: string }) => {
  return (
    <Flex
      direction="column"
      gap="md"
    >
      {title && <Title order={6}>{title}</Title>}
      {children}
      <Divider />
    </Flex>
  );
};

const FeedbackPage = () => {
  const form = useForm<IFeedbackFormValues>({
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
      form.reset();
    },
    onError: (error) => {
      handleZodError(
        error.data?.zodError,
        error.message ?? "Dein Feedback konnte nicht erfolgreich ermittelt werden"
      );
    },
  });

  const sendFeedback = form.onSubmit(() => {
    pushFeedbackToDatabase({
      ...form.values,
      browser: browserName,
      os,
    });
  });

  return (
    <PageLayout>
      <form onSubmit={sendFeedback}>
        <Center>
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
                autosize
                minRows={5}
                maxLength={MAX_TEXTAREA_LENGTH}
                {...form.getInputProps("comment")}
              />
              <span>
                {form.values.comment.length} / {MAX_TEXTAREA_LENGTH} Zeichen
              </span>
            </FormSection>

            <Button
              type="submit"
              loading={isLoading}
            >
              Feedback senden
            </Button>
          </Flex>
        </Center>
      </form>
    </PageLayout>
  );
};

export default FeedbackPage;
