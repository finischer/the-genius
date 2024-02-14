import {
  Button,
  Checkbox,
  Flex,
  Modal,
  NumberInput,
  Select,
  Text,
  TextInput,
  SegmentedControl,
  type SegmentedControlItem,
  Input,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { GameshowMode } from "@prisma/client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import type { TGame } from "~/components/room/Game/games/game.types";
import { socket } from "~/hooks/useSocket";
import { useUser } from "~/hooks/useUser";
import { GAMESHOW_MODES } from "~/styles/constants";
import { capitalize } from "~/utils/strings";
import { type ICreateRoomConfig, type ICreateRoomModalProps } from "./createRoomModal.types";

const CreateRoomModal: React.FC<ICreateRoomModalProps> = ({ openedModal, onClose, gameshow }) => {
  const gameshowGames = gameshow.games as unknown as TGame[];
  const hasGameForOnlyTeamMode = gameshowGames.filter((g) => g.modes.every((m) => m === "TEAM")).length > 0;

  const form = useForm<ICreateRoomConfig>({
    initialValues: {
      name: "",
      modus: hasGameForOnlyTeamMode ? GameshowMode.TEAM : GameshowMode.DUELL,
      isPrivate: true,
      password: "",
      games: [],
    },
  });
  const [loader, setLoader] = useState({
    isLoading: false,
    loaderMsg: "",
  });

  const { user } = useUser();
  const router = useRouter();

  const selectData: SegmentedControlItem[] = GAMESHOW_MODES.map((m) => ({
    value: m,
    label: capitalize(m),
  }));

  useEffect(() => {
    // reset form when modal was opened
    form.reset();
  }, [openedModal]);

  const createRoom = form.onSubmit((values) => {
    setLoader({
      isLoading: true,
      loaderMsg: "Raum wird erstellt ...",
    });
    // create room on server
    socket.emit("createRoom", { user, roomConfig: values, gameshow }, (room) => {
      setLoader({
        isLoading: true,
        loaderMsg: "Raum wird beigetreten ...",
      });
      // connect to room
      void router.push(`/room/${room.id}`);
    });
  });

  return (
    <Modal
      opened={openedModal}
      onClose={onClose}
      title={gameshow.name}
      centered
    >
      <form onSubmit={createRoom}>
        <Flex
          gap="md"
          direction="column"
        >
          <TextInput
            label="Raumname"
            placeholder="Maroom 5"
            required
            {...form.getInputProps("name")}
          />

          <Input.Wrapper
            label="Modus"
            required
          >
            <SegmentedControl
              fullWidth
              data={selectData}
              readOnly={hasGameForOnlyTeamMode}
              disabled={hasGameForOnlyTeamMode}
              {...form.getInputProps("modus")}
            />
          </Input.Wrapper>

          {hasGameForOnlyTeamMode && (
            <Text
              c="dimmed"
              size="sm"
            >
              Hinweis: Der Modus kann nicht geändert werden, da die Spielshow mind. 1 Spiel enthält, welches
              im Team gespielt werden muss.
            </Text>
          )}
          <Checkbox
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
          )}

          <NumberInput
            label="Anzahl Spiele"
            value={gameshow.games.length}
            readOnly
          />
          <Button
            type="submit"
            loading={loader.isLoading}
          >
            {loader.isLoading ? loader.loaderMsg : "Raum erstellen"}
          </Button>
        </Flex>
      </form>
    </Modal>
  );
};

export default CreateRoomModal;
