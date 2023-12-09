import { Card, Container, Divider, Flex, Group, Rating, Text, type TextProps } from "@mantine/core";
import React from "react";
import { formatTimestamp } from "~/utils/dates";
import type { IFeedbackCardProps } from "./feedbackCard.types";

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

const MetadataLine = ({ content, ...props }: { content: string } & TextProps) => (
  <Group>
    <Text
      fz="xs"
      c="dimmed"
      {...props}
    >
      {content}
    </Text>
  </Group>
);

const FeedbackCard: React.FC<IFeedbackCardProps> = ({ feedback }) => {
  return (
    <Card withBorder>
      {/* Feedback Metadata */}
      <Flex
        direction="column"
        gap="0.25rem"
      >
        <MetadataLine
          content={`Feedback-ID: ${feedback.id}`}
          fz="md"
          fw={700}
        />
        <MetadataLine
          content={`Eingereicht von: ${feedback.creator.username ?? "USER_NOT_FOUND"} • ${
            feedback.creator.email
          }`}
          fz="sm"
        />
        <MetadataLine content={`Erstellt am: ${formatTimestamp(feedback.createdAt.toString())}`} />
        <MetadataLine content={`Betriebssystem: ${feedback.os}`} />
        <MetadataLine content={`Browser: ${feedback.browser}`} />
      </Flex>

      {/* Feedback Content */}
      <Container
        m={0}
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
