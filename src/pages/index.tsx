import { Button, Card, Group, Text } from "@mantine/core";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import PageLayout from "~/components/layout";
import { api } from "~/utils/api";

// TODO: Create Home page

const Home: NextPage = () => {
  const { data: rooms } = api.rooms.getAll.useQuery();
  const router = useRouter();

  const numOfRooms = rooms?.length ?? 0;

  const txt = numOfRooms === 0 ? "Keine" : numOfRooms === 1 ? "Ein Raum" : `${numOfRooms ?? 0} Räume`;

  return (
    <PageLayout>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        w="20rem"
      >
        <Group mb="xs">
          <Text fw={500}>Raum beitreten</Text>
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
          fullWidth
          mt="md"
          radius="md"
          onClick={() => void router.push("/rooms")}
        >
          Zu den Räumen
        </Button>
      </Card>
    </PageLayout>
  );
};

export default Home;
