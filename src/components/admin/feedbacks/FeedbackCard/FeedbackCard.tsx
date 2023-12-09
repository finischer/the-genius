import React from "react";
import type { IFeedbackCardProps } from "./feedbackCard.types";
import { Card, Divider, Flex, Group, Rating, RingProgress, SimpleGrid, Text } from "@mantine/core";

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
  console.log(feedback.comment.replace(/\\n/g, "\n"));
  return (
    <Card withBorder>
      <Group>
        <Text
          fz="sm"
          fw={700}
        >
          Feedback-ID: {feedback.id}
        </Text>
      </Group>

      <Group>
        <Text
          fz="xs"
          c="dimmed"
        >
          User: {feedback.creator.username} • {feedback.creator.email}
        </Text>
      </Group>

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

      <Group>
        <Text>Kommentar: </Text>
        <Text
          c="dimmed"
          fz="md"
        >
          {feedback.comment}
        </Text>
      </Group>
    </Card>
  );
};

export default FeedbackCard;
