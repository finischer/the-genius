import { Button, Flex, LoadingOverlay, Modal, PasswordInput, Table, Text, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useState } from "react";
import PageLayout from "~/components/layout";
import NextHead from "~/components/shared/NextHead";
import useNotification from "~/hooks/useNotification";
import type { SafedRoom } from "~/server/api/routers/rooms";
import { api } from "~/utils/api";
import { formatTimestamp } from "~/utils/dates";

const REFETCH_INTERVAL = 5000;

const RoomsPage = () => {
  const router = useRouter();
  const { showErrorNotification } = useNotification();

  const { mutate: validatePassword, isLoading: isLoadingValidatePassword } =
    api.rooms.validatePassword.useMutation({
      onSuccess: ({ isValidPassword, roomId }) => {
        if (isValidPassword) {
          void joinRoom(roomId);
        } else {
          form.setFieldError("password", "Falsches Passwort");
        }
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors;
        const errorMessagesArray = errorMessage ? Object.values(errorMessage) : [];

        if (errorMessagesArray.length > 0) {
          errorMessagesArray.forEach((messages) => {
            if (messages && messages[0]) {
              showErrorNotification({
                title: "Ein Fehler ist aufgetreten",
                message: messages[0],
              });
            }
          });
        } else {
          showErrorNotification({
            title: "Ein Fehler ist aufgetreten",
            message: e.message ?? "Probiere es später nochmal",
          });
        }
      },
    });

  const form = useForm({
    initialValues: {
      password: "",
    },
  });
  const [openedPasswordModal, { open: openPasswordModal, close: closePasswordModal }] = useDisclosure();
  const { data: rooms, isLoading } = api.rooms.getAll.useQuery(undefined, {
    refetchInterval: REFETCH_INTERVAL,
  });
  const [activeRoom, setActiveRoom] = useState<SafedRoom | undefined>(undefined);

  const rows =
    rooms?.map((room) => {
      // const nameOfCurrentGame = room.games.find(g => g.identifier === room.currentGame)?.name

      return (
        <Table.Tr
          key={room.id}
          style={{ cursor: "pointer" }}
          onClick={() => handleRoomClick(room)}
        >
          <Table.Td>{room.name}</Table.Td>
          <Table.Td>{room.isPrivate ? "Privat" : "Öffentlich"}</Table.Td>
          <Table.Td>{room.modus}</Table.Td>
          <Table.Td>
            {room.participants.length} / {room.roomSize}
          </Table.Td>
          {/* <Table.Td>{nameOfCurrentGame || "Kein Spiel gestartet"}</Table.Td> */}
          <Table.Td>{room.creator.username}</Table.Td>
          <Table.Td>{formatTimestamp(room.createdAt)}</Table.Td>
        </Table.Tr>
      );
    }) ?? [];

  const handleRoomClick = (room: SafedRoom) => {
    setActiveRoom(room);
    if (room.isPrivate && !room.isCreator) {
      form.reset();
      openPasswordModal();
    } else {
      void joinRoom(room.id);
    }
  };

  const joinRoom = async (roomId: string) => {
    notifications.show({
      id: "joinRoom",
      title: "Trete bei ...",
      message: "Du trittst dem Raum jetzt bei",
      loading: true,
    });
    const routeDone = await router.push(`/room/${roomId}`);
    if (routeDone) {
      notifications.update({
        id: "joinRoom",
        title: "Erfolgreich",
        message: "Raum erfolgreich beigetreten",
        icon: <IconCheck size="1rem" />,
      });
    }
  };

  const handleJoinRoomWithPassword = form.onSubmit((values) => {
    if (!activeRoom) return;

    // validate password on server side
    validatePassword({
      roomId: activeRoom.id,
      password: values.password,
    });
  });

  return (
    <>
      <NextHead title="Räume" />
      {activeRoom && (
        <Modal
          onClose={closePasswordModal}
          opened={openedPasswordModal}
          title={`Gib das Passwort für ${activeRoom.name} ein`}
          centered
        >
          <LoadingOverlay
            visible={isLoadingValidatePassword}

            // overlayBlur={2}
          />
          <form onSubmit={handleJoinRoomWithPassword}>
            <Flex
              direction="column"
              gap="md"
            >
              <PasswordInput
                label="Passwort"
                placeholder="Super geheimes passwort"
                required
                {...form.getInputProps("password")}
              />
              <Button type="submit">Raum beitreten</Button>
            </Flex>
          </form>
        </Modal>
      )}
      <PageLayout
        showLoader={isLoading}
        loadingMessage="Räume werden geladen ..."
      >
        <Flex direction="row">
          <Title order={2}>Tritt einem Raum bei</Title>
          {/* <Flex align="center">
                        <IconPoint size={24} color={colors.success} fill={colors.success} />
                        <Text>{playersOnline} Spieler online</Text>
                    </Flex> */}
        </Flex>
        <Text c="dimmed">{rows.length} Räume sind verfügbar</Text>
        <Table
          verticalSpacing="md"
          striped
          highlightOnHover
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Sichtbarkeit</Table.Th>
              <Table.Th>Modus</Table.Th>
              <Table.Th>Spieler</Table.Th>
              {/* <Table.Th>Aktuelles Spiel</Table.Th> */}
              <Table.Th>Erstellt von</Table.Th>
              <Table.Th>Erstellt am</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </PageLayout>
    </>
  );
};

export default RoomsPage;
