import { Flex, Table, Text, Title, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlayerPlay, IconPlus, IconSettings, IconStar, IconStarFilled } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useState } from "react";
import PageLayout from "~/components/layout";
import ActionIcon from "~/components/shared/ActionIcon";
import CreateRoomModal from "~/components/shared/CreateRoomModal";
import NextHead from "~/components/shared/NextHead";
import useLoadingState from "~/hooks/useLoadingState/useLoadingState";
import type { SafedGameshow } from "~/server/api/routers/gameshows";
import { api } from "~/utils/api";
import { formatTimestamp } from "~/utils/dates";

const GameshowsPage = () => {
  const theme = useMantineTheme();
  const { pageIsLoading } = useLoadingState();
  const router = useRouter();
  const { data: gameshows, isLoading } = api.gameshows.getAllByCreatorId.useQuery();
  const [openedCreateRoomModal, { open: openCreateRoomModal, close: closeCreateRoomModal }] =
    useDisclosure(false);
  const [activeGameshow, setActiveGameshow] = useState<SafedGameshow | undefined>(undefined);

  const subtitleText =
    gameshows?.length === 0
      ? "Du hast bisher noch keine Spielshow erstellt"
      : `Du hast bereits ${gameshows?.length || "NOT_FOUND"} Spielshows erstellt`;

  const createRoom = (gameshow: SafedGameshow) => {
    // get whole gameshow from db
    setActiveGameshow(gameshow);
    openCreateRoomModal();
  };

  const handleCreateGameshow = () => {
    void router.push("/gameshows/create");
  };

  const rows =
    gameshows?.map((gameshow) => {
      return (
        <Table.Tr key={gameshow.id}>
          <Table.Td>{gameshow.name}</Table.Td>
          <Table.Td>{gameshow.numOfGames}</Table.Td>
          <Table.Td>{formatTimestamp(gameshow.createdAt)}</Table.Td>
          <Table.Td>
            <Flex gap="xl">
              <ActionIcon
                toolTip="Bearbeiten"
                disabled
              >
                <IconSettings />
              </ActionIcon>
              <ActionIcon
                toolTip="Als Favorit hinzufügen"
                color="yellow"
                disabled
              >
                {gameshow.isFavorite ? <IconStarFilled /> : <IconStar />}
              </ActionIcon>
              <ActionIcon
                toolTip="Raum erstellen"
                color="green"
                onClick={() => createRoom(gameshow)}
              >
                <IconPlayerPlay />
              </ActionIcon>
            </Flex>
          </Table.Td>
        </Table.Tr>
      );
    }) ?? [];

  return (
    <>
      <NextHead title="Meine Spielshows" />
      <PageLayout
        showLoader={isLoading}
        loadingMessage="Spielshows werden geladen ..."
      >
        {activeGameshow && (
          <CreateRoomModal
            openedModal={openedCreateRoomModal}
            onClose={closeCreateRoomModal}
            gameshow={activeGameshow}
          />
        )}
        <Flex
          gap="md"
          align="center"
        >
          <Title order={2}>Meine Spielshows</Title>
          <ActionIcon
            toolTip="Spielshow erstellen"
            color={theme.primaryColor}
            variant="filled"
            onClick={handleCreateGameshow}
            loading={pageIsLoading}
          >
            <IconPlus />
          </ActionIcon>
        </Flex>
        <Text c="dimmed">{subtitleText}</Text>
        <Table
          verticalSpacing="md"
          striped
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Anzahl Spiele</Table.Th>
              <Table.Th>Erstellt am</Table.Th>
              <Table.Th>Aktion</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </PageLayout>
    </>
  );
};

export default GameshowsPage;
