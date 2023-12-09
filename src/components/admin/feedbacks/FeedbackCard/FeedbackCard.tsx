import React from "react";
import type { IFeedbackCardProps } from "./feedbackCard.types";
import { Card, Container, Divider, Flex, Group, Rating, RingProgress, SimpleGrid, Text } from "@mantine/core";
import { formatTimestamp } from "~/utils/dates";

const FeedbackRatingSection = ({ title, rating }: { title: string; rating: number }) => {
  return (
    <Group align="center">
      <Text w="10rem">{title}</Text>
      <Rating
        value={rating}
        readOnly
      />
    </Group>
  );
};

const FeedbackCard: React.FC<IFeedbackCardProps> = ({ feedback }) => {
  return (
    <Card withBorder>
      {/* Feedback Metadata */}
      <Flex
        direction="column"
        gap="0.25rem"
      >
        <Group>
          <Text
            fz="md"
            fw={700}
          >
            Feedback-ID: {feedback.id}
          </Text>
        </Group>

        <Group>
          <Text
            fz="sm"
            c="dimmed"
          >
            Eingereicht von: {feedback.creator.username} • {feedback.creator.email}
          </Text>
        </Group>

        <Group>
          <Text
            fz="xs"
            c="dimmed"
          >
            Erstellt am: {formatTimestamp(feedback.createdAt.toString())}
          </Text>
        </Group>
      </Flex>

      {/* Feedback Content */}
      <Container
        p={0}
        mt="md"
      >
        <FeedbackRatingSection
          title="Allgemein"
          rating={feedback.ratingGeneralExperience}
        />
        <Divider my="xs" />

        <FeedbackRatingSection
          title="Steuerung als Moderator"
          rating={feedback.ratingControlModerator}
        />

        <Divider my="xs" />

        <FeedbackRatingSection
          title="Design"
          rating={feedback.ratingDesign}
        />

        <Divider my="xs" />

        <Group align="flex-start">
          <Text>Kommentar: </Text>
          <Text
            c="dimmed"
            fz="md"
            dangerouslySetInnerHTML={{ __html: feedback.comment.replace(/\n/g, "<br />") }} // show line breaks
          />
        </Group>
      </Container>
    </Card>
  );
};

export default FeedbackCard;
