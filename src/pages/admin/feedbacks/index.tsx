import { Divider, Flex } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import React from "react";
import FeedbackCard from "~/components/admin/feedbacks/FeedbackCard";
import FeedbackList from "~/components/admin/feedbacks/FeedbackList";
import PageLayout from "~/components/layout";
import ActionIcon from "~/components/shared/ActionIcon";
import { api } from "~/utils/api";

const FeedbackPage = () => {
  const { data: feedbacks, isLoading, refetch: refreshFeedback } = api.feedbacks.getAll.useQuery();

  return (
    <PageLayout
      showLoader={isLoading}
      loadingMessage="Feedback wird geladen ..."
    >
      <ActionIcon
        toolTip="Aktualisieren"
        variant="filled"
        color="brand"
        onClick={() => {
          refreshFeedback();
        }}
      >
        <IconRefresh size="1.25rem" />
      </ActionIcon>

      <Divider my="md" />

      {feedbacks && <FeedbackList feedbacks={feedbacks} />}
    </PageLayout>
  );
};

export default FeedbackPage;
