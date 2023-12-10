import { Divider, useMantineTheme } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import FeedbackList from "~/components/admin/feedbacks/FeedbackList";
import withAdminAuth from "~/components/admin/withAdminAuth";
import PageLayout from "~/components/layout";
import ActionIcon from "~/components/shared/ActionIcon";
import { api } from "~/utils/api";

const FeedbackPage = () => {
  const theme = useMantineTheme();
  const { data: feedbacks, isLoading, refetch: refreshFeedback } = api.feedbacks.getAll.useQuery();
  return (
    <PageLayout
      showLoader={isLoading}
      loadingMessage="Feedback wird geladen ..."
    >
      <ActionIcon
        toolTip="Aktualisieren"
        variant="filled"
        color={theme.primaryColor}
        onClick={() => {
          void refreshFeedback();
        }}
      >
        <IconRefresh size="1.25rem" />
      </ActionIcon>

      <Divider my="md" />

      {feedbacks && <FeedbackList feedbacks={feedbacks} />}
    </PageLayout>
  );
};

export default withAdminAuth(FeedbackPage);
