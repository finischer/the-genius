import {
  Button,
  Flex,
  Input,
  Modal,
  NumberInput,
  SegmentedControl,
  Text,
  TextInput,
  type SegmentedControlItem
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { GameshowMode } from "~/generated/prisma/enums";
import { useSyncedStore } from "@syncedstore/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { initRoom, roomStore } from "~/config/store";
import useNotification from "~/hooks/useNotification";
import { useUser } from "~/hooks/useUser";
import { GAMESHOW_MODES } from "~/styles/constants";
import { api } from "~/utils/api";
import { capitalize } from "~/utils/strings";
import {
  type ICreateRoomConfig,
  type ICreateRoomModalProps
} from "./createRoomModal.types";
import type { GameState } from "~/games";

const CreateRoomModal: React.FC<ICreateRoomModalProps> = ({
  openedModal,
  onClose,
  gameshow
}) => {
  const gameshowGames = gameshow.games as unknown as GameState[];
  const hasGameForOnlyTeamMode =
    gameshowGames.filter((g) => g.modes.every((m) => m === "TEAM")).length > 0;

  const form = useForm<ICreateRoomConfig>({
    initialValues: {
      name: "",
      modus: hasGameForOnlyTeamMode ? GameshowMode.TEAM : GameshowMode.DUELL,
      isPrivate: true,
      games: []
    }
  });
  const [loader, setLoader] = useState({
    isLoading: false,
    loaderMsg: ""
  });

  const { user } = useUser();
  const router = useRouter();
  const { handleZodError, showErrorNotification } = useNotification();

  const store = useSyncedStore(roomStore);

  const selectData: SegmentedControlItem[] = GAMESHOW_MODES.map((m) => ({
    value: m,
    label: capitalize(m)
  }));

  useEffect(() => {
    // reset form when modal was opened
    form.reset();
  }, [openedModal]);

  // const { mutateAsync: createParty } = api.parties.create.useMutation();
  const { mutateAsync: createRoomInDb } = api.rooms.addRoom.useMutation({
    onError: (error) =>
      handleZodError(
        error.data?.zodError,
        error.message ?? "Raum konnte nicht erstellt werden"
      )
  });

  const createRoom = form.onSubmit(async (values) => {
    setLoader({
      isLoading: true,
      loaderMsg: "Raum wird erstellt ..."
    });

    const maxPlayersPerTeam = values.modus === GameshowMode.DUELL ? 1 : 2;

    const room = initRoom(
      values.name,
      gameshow.games as GameState[],
      user.id,
      maxPlayersPerTeam
    );

    store.room.state = room;

    const dbRoom = await createRoomInDb({
      id: room.id
    });

    if (!dbRoom) {
      showErrorNotification({
        title: "Fehler",
        message: "Raum konnte nicht erstellt werden"
      });
      return;
    }

    // await createParty({
    //   id: room.id,
    //   config: values,
    // });

    void router.push(`/room/${room.id}`);
  });

  return (
    <Modal
      opened={openedModal}
      onClose={onClose}
      title={gameshow.name}
      centered
    >
      <form onSubmit={createRoom}>
        <Flex gap="md" direction="column">
          <TextInput
            label="Raumname"
            placeholder="Maroom 5"
            required
            {...form.getInputProps("name")}
          />

          <Input.Wrapper label="Modus" required>
            <SegmentedControl
              fullWidth
              data={selectData}
              readOnly={hasGameForOnlyTeamMode}
              disabled={hasGameForOnlyTeamMode}
              {...form.getInputProps("modus")}
            />
          </Input.Wrapper>

          {hasGameForOnlyTeamMode && (
            <Text c="dimmed" size="sm">
              Hinweis: Der Modus kann nicht geändert werden, da die Spielshow
              mind. 1 Spiel enthält, welches im Team gespielt werden muss.
            </Text>
          )}
          {/* <Checkbox
            label="Privater Raum"
            {...form.getInputProps("isPrivate", { type: "checkbox" })}
          />
          {form.values.isPrivate && (
            <TextInput
              label="Passwort"
              placeholder="mySecretRoomPassword"
              required
              {...form.getInputProps("password")}
            />
          )} */}

          <NumberInput
            label="Anzahl Spiele"
            value={gameshow.games.length}
            readOnly
          />
          <Button type="submit" loading={loader.isLoading}>
            {loader.isLoading ? loader.loaderMsg : "Raum erstellen"}
          </Button>
        </Flex>
      </form>
    </Modal>
  );
};

export default CreateRoomModal;
