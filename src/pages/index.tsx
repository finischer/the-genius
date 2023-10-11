import { Badge, Button, Card, Group, Image, Skeleton, Text, Title } from "@mantine/core";
import { type NextPage } from "next";
import PageLayout from "~/components/layout";
import { api } from "~/utils/api";

// TODO: Create Home page

const Home: NextPage = () => {
  const { data: rooms, isLoading } = api.rooms.getAll.useQuery();

  const txt = rooms?.length === 0 ? "Keine" : rooms?.length === 1 ? "Ein Raum" : `${rooms?.length} Räume`;

  return (
    <PageLayout>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        w="40rem"
      >
        <Group
          mt="md"
          mb="xs"
        >
          <Text fw={500}>Räume beitreten</Text>
        </Group>

        {rooms && (
          <Text
            size="sm"
            c="dimmed"
          >
            {txt} verfügbar
          </Text>
        )}

        <Button
          variant="light"
          color="blue"
          fullWidth
          mt="md"
          radius="md"
        >
          Verfügbare Räume anschauen
        </Button>
      </Card>
    </PageLayout>
  );
};

export default Home;
