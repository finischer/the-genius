import { Center, Flex, Progress, Stack, Text, useMantineTheme } from "@mantine/core";
import { IconSquareRoundedPlus } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Loader from "~/components/shared/Loader";
import Paper from "~/components/shared/Paper";
import { FEATURES } from "~/config/features";
import { api } from "~/utils/api";

const InfoSection = () => {
  const { push } = useRouter();
  const theme = useMantineTheme();
  const { data: gameshows, isLoading } = api.gameshows.getAllByCreatorId.useQuery();
  const { data: session } = useSession();

  const maxNumGameshows = FEATURES[session?.user.role ?? "USER"].maxNumGameshows;

  const gameshowsCreatedPercentage = gameshows ? Math.round((gameshows.length / maxNumGameshows) * 100) : 0;

  return (
    <Paper
      w={400}
      h="100%"
      p="xl"
      display="flex"
      style={{
        flexDirection: "column",
        gap: theme.spacing.lg,
      }}
      shadow="md"
    >
      <Paper
        variant="light"
        h={250}
        onClick={() => void push("/gameshows/create")}
      >
        <Flex
          justify="center"
          align="center"
          h="100%"
          direction="column"
        >
          <IconSquareRoundedPlus />
          <Text>Spielshow erstellen</Text>
        </Flex>
      </Paper>

      <Paper
        variant="light"
        onClick={() => void push("/gameshows")}
      >
        {isLoading && (
          <Center>
            <Loader message="Lädt ..." />
          </Center>
        )}

        {!isLoading && gameshows && (
          <Stack>
            <Flex justify="space-between">
              <Text fz="md">Meine Spielshows</Text>
              <Text fz="md">{100 - gameshowsCreatedPercentage} % frei</Text>
            </Flex>
            <Text c="dimmed">
              {gameshows.length} von {maxNumGameshows === Infinity ? "∞" : maxNumGameshows} erstellt
            </Text>

            <Progress value={gameshowsCreatedPercentage} />
          </Stack>
        )}
      </Paper>
    </Paper>
  );
};

export default InfoSection;
