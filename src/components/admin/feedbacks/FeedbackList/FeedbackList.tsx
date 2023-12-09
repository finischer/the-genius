import React from "react";
import { api } from "~/utils/api";
import FeedbackCard from "../FeedbackCard";
import type { IFeedbackListProps } from "./feedbackList.types";
import { Flex } from "@mantine/core";

const FeedbackList: React.FC<IFeedbackListProps> = ({ feedbacks }) => {
  const feedbackCardsElements = feedbacks.map((feedback) => (
    <FeedbackCard
      key={feedback.id}
      feedback={feedback}
    />
  ));

  return (
    <Flex
      direction="column"
      gap="md"
    >
      {feedbackCardsElements}
    </Flex>
  );
};

export default FeedbackList;
