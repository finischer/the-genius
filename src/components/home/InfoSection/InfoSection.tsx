import { Box, Flex, Group, Progress, Stack, Text, useMantineTheme } from "@mantine/core";
import { IconSquareRoundedPlus } from "@tabler/icons-react";
import { useRouter } from "next/router";
import Paper from "~/components/shared/Paper";

const InfoSection = () => {
  const { push } = useRouter();
  const theme = useMantineTheme();

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
        <Stack>
          <Flex justify="space-between">
            <Text fz="md">Meine Spielshows</Text>
            <Text fz="md">33 % frei</Text>
          </Flex>
          <Text c="dimmed">2 von 3 erstellt</Text>

          <Progress value={33} />
        </Stack>
      </Paper>
    </Paper>
  );
};

export default InfoSection;
