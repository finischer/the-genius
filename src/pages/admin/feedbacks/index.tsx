import { Center, Divider, Flex, Text, useMantineTheme } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import FeedbackList from "~/components/admin/feedbacks/FeedbackList";
import withAdminAuth from "~/components/admin/withAdminAuth";
import PageLayout from "~/components/layout/PageLayout";
import ActionIcon from "~/components/shared/ActionIcon";
import { api } from "~/utils/api";

const FeedbackPage = () => {
  const theme = useMantineTheme();
  const {
    data: feedbacks,
    refetch: refreshFeedback,
    isLoading,
    isFetching,
  } = api.feedbacks.getAll.useQuery();
  return (
    <PageLayout
      showLoader={isLoading}
      loadingMessage="Feedback wird geladen ..."
    >
      <ActionIcon
        toolTip="Aktualisieren"
        loading={isFetching}
        variant="filled"
        color={theme.primaryColor}
        onClick={() => {
          void refreshFeedback();
        }}
      >
        <IconRefresh size="1rem" />
      </ActionIcon>

      <Divider my="md" />

      {feedbacks && feedbacks.length > 0 && <FeedbackList feedbacks={feedbacks} />}
      {feedbacks?.length === 0 && (
        <Flex
          h="100%"
          justify="center"
          align="center"
        >
          <Text>Es wurde noch kein Feedback eingereicht</Text>
        </Flex>
      )}
    </PageLayout>
  );
};

export default withAdminAuth(FeedbackPage);
