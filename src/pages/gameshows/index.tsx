import { Flex, Menu, Table, Text, Title, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import type { Gameshow } from "@prisma/client";
import {
  IconDots,
  IconEdit,
  IconPlayerPlay,
  IconPlus,
  IconStar,
  IconStarFilled,
  IconTrash,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useState } from "react";
import PageLayout from "~/components/layout/PageLayout";
import type { TGame } from "~/components/room/Game/games/game.types";
import ActionIcon from "~/components/shared/ActionIcon";
import CreateRoomModal from "~/components/shared/CreateRoomModal";
import NextHead from "~/components/shared/NextHead";
import type { TGameshowConfig } from "~/hooks/useGameshowConfig/useGameConfigurator.types";
import useLoadingState from "~/hooks/useLoadingState/useLoadingState";
import useNotification from "~/hooks/useNotification";
import type { SafedGameshow } from "~/server/api/routers/gameshows";
import { api } from "~/utils/api";
import { formatTimestamp } from "~/utils/dates";

const MENU_ICON_SIZE = 14;

const ActionMenu = ({
  gameshow,
  onDeleteGameshow,
}: {
  gameshow: Gameshow;
  onDeleteGameshow: (gameshowId: string) => void;
}) => {
  const StarIcon = gameshow.isFavorite ? (
    <IconStarFilled size={MENU_ICON_SIZE} />
  ) : (
    <IconStar size={MENU_ICON_SIZE} />
  );
  const router = useRouter();

  const openDeleteConfirmModal = () =>
    modals.openConfirmModal({
      title: <Text>Möchtest du wirklich die Spielshow &quot;{gameshow.name}&quot; löschen?</Text>,
      centered: true,
      children: (
        <Text size="sm">
          Diese Aktion ist unwiderruflich und führt dazu, dass alle Daten und Einstellungen der Spielshow
          dauerhaft entfernt werden. Bist du sicher, dass Du fortfahren möchtest?
        </Text>
      ),
      labels: {
        confirm: "Spielshow löschen",
        cancel: "Abbrechen",
      },
      confirmProps: { color: "red" },
      onConfirm: () => onDeleteGameshow(gameshow.id),
    });

  const handleEditGameshow = () => {
    const gameshowConfig: TGameshowConfig = {
      name: gameshow.name,
      games: gameshow.games as unknown as TGame[],
    };

    const searchParams = new URLSearchParams();
    searchParams.set("gameshowId", gameshow.id);
    searchParams.set("action", "update");

    void router.push(`/gameshows/create?gameshowId=${gameshow.id}&action=update`);
  };

  return (
    <Menu>
      <ActionIcon variant="default">
        <Menu.Target>
          <IconDots />
        </Menu.Target>
      </ActionIcon>
      <Menu.Dropdown>
        <Menu.Label>Aktionen für {gameshow.name}</Menu.Label>
        <Menu.Item
          leftSection={<IconEdit size={MENU_ICON_SIZE} />}
          onClick={handleEditGameshow}
        >
          Bearbeiten
        </Menu.Item>
        <Menu.Item
          disabled
          leftSection={StarIcon}
        >
          Als Favorit {gameshow.isFavorite ? "entfernen" : "hinzufügen"}
        </Menu.Item>
        <Menu.Item
          color="red"
          leftSection={<IconTrash size={MENU_ICON_SIZE} />}
          onClick={openDeleteConfirmModal}
        >
          Löschen
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

const GameshowsPage = () => {
  const theme = useMantineTheme();
  const { pageIsLoading } = useLoadingState();
  const router = useRouter();

  const { showSuccessNotification, handleZodError } = useNotification();

  const {
    data: gameshows,
    isLoading,
    refetch: refetchGameshows,
  } = api.gameshows.getAllByCreatorId.useQuery();
  const { mutate: deleteGameshow } = api.gameshows.delete.useMutation({
    onSuccess: () => {
      showSuccessNotification({
        message: "Spielshow wurde erfolgreich gelöscht",
      });
      void refetchGameshows();
    },
    onError: (error) => {
      handleZodError(error.data?.zodError, error.message ?? "Spielshow konnte nicht gelöscht werden");
    },
  });

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

  const handleDeleteGameshow = (gameshowId: string) => {
    void deleteGameshow({ gameshowId });
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
              {/* <ActionIcon
                toolTip="Als Favorit hinzufügen"
                color="yellow"
                disabled
              >
                {gameshow.isFavorite ? <IconStarFilled /> : <IconStar />}
              </ActionIcon> */}
              <ActionIcon
                toolTip="Raum erstellen"
                color="green"
                onClick={() => createRoom(gameshow)}
              >
                <IconPlayerPlay />
              </ActionIcon>

              <ActionMenu
                gameshow={gameshow}
                onDeleteGameshow={handleDeleteGameshow}
              />
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
