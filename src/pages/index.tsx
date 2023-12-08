import { Button, Card, Group, Text } from "@mantine/core";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import PageLayout from "~/components/layout";
import { api } from "~/utils/api";

// TODO: Create Home page

const Home: NextPage = () => {
  const router = useRouter();

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
          <Text fw={500}>Räume</Text>
        </Group>

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
