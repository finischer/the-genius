import { Flex } from "@mantine/core";
import React from "react";
import FeedbackCard from "../FeedbackCard";
import type { IFeedbackListProps } from "./feedbackList.types";

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
