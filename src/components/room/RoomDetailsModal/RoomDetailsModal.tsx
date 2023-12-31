import { ActionIcon, Button, CopyButton, Flex, Modal, Table, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React from "react";
import useLoadingState from "~/hooks/useLoadingState/useLoadingState";
import { socket } from "~/hooks/useSocket";
import { type IRoomDetailsModalProps } from "./roomDetailsModal.types";

const RoomDetailsModal: React.FC<IRoomDetailsModalProps> = ({ openedModal, onClose, room }) => {
  const { pageIsLoading } = useLoadingState();
  const router = useRouter();
  const roomId = router.query.id as string;

  const leaveRoom = () => {
    modals.openConfirmModal({
      id: "leaveRoom",
      title: "Bist du dir sicher?",
      children: <Text size="sm">Möchtest du wirklich den Raum verlassen?</Text>,
      labels: { confirm: "Ja", cancel: "Nein" },
      onConfirm: async () => {
        notifications.show({
          id: "leaveRoom",
          title: "Raum verlassen",
          message: "Du verlässt jetzt den Raum",
          loading: true,
        });
        socket.emit("leaveRoom", { roomId });
        // initUser();
        const routeDone = await router.push("/rooms/");
        if (routeDone) {
          notifications.update({
            id: "leaveRoom",
            title: "Erfolgreich",
            message: "Raum erfolgreich verlassen",
            loading: false,
            icon: <IconCheck size="1rem" />,
          });
        }
      },
    });
  };

  return (
    <Modal
      opened={openedModal}
      onClose={onClose}
      title="Rauminformationen"
      centered
    >
      <Flex
        direction="column"
        gap="xl"
      >
        <Table>
          <tbody>
            <tr>
              <td>Raum-ID:</td>
              <td>{room.id}</td>
              <td style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CopyButton
                  timeout={2000}
                  value={room.id}
                >
                  {({ copied, copy }) =>
                    copied ? (
                      <IconCheck size="1.5rem" />
                    ) : (
                      <ActionIcon
                        size="1.5rem"
                        onClick={copy}
                      >
                        <IconCopy />
                      </ActionIcon>
                    )
                  }
                </CopyButton>
              </td>
            </tr>
            <tr>
              <td>Name:</td>
              <td>{room.name}</td>
            </tr>
            {/* <tr>
                            <td>Erstellt von:</td>
                            <td>{room.creatorId || "-"}</td>
                        </tr> */}
            <tr>
              <td>Modus:</td>
              <td>{room.modus}</td>
            </tr>
            <tr>
              <td>Anzahl Spiele:</td>
              <td>{room.games.length}</td>
            </tr>
            <tr>
              <td>Sichtbarkeit:</td>
              <td>{room.isPrivate ? "Privat" : "Öffentlich"}</td>
            </tr>
          </tbody>
        </Table>

        <Button
          variant="subtle"
          onClick={leaveRoom}
          loading={pageIsLoading}
        >
          Raum verlassen
        </Button>
      </Flex>
    </Modal>
  );
};

export default RoomDetailsModal;
