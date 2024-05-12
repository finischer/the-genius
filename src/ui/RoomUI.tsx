import { Box, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import type { RoomSounds } from "@prisma/client";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";
import ModPanel from "~/components/room/ModPanel";
import RoomBody from "~/components/room/RoomBody";
import RoomFooter from "~/components/room/RoomFooter";
import RoomHeader from "~/components/room/RoomHeader";
import ActionIcon from "~/components/shared/ActionIcon";
import ModView from "~/components/shared/ModView";
import { connectToSocket } from "~/config/store";
import useAudio from "~/hooks/useAudio";
import useMusic from "~/hooks/useMusic";
import useSyncedRoom from "~/hooks/useSyncedRoom";
import { sizes } from "~/styles/constants";
import { displayObject } from "~/utils/helpers";

const RoomUI = () => {
  const params = useParams();
  const { playAudio } = useAudio();
  const { play: playMusic, stop: stopMusic, pause: pauseMusic } = useMusic();

  const roomId = params?.id as string;
  const router = useRouter();

  const room = useSyncedRoom();
  const sounds = room.context?.audio.sounds ?? [];
  const musicState = room.context?.audio.music ?? {
    isActive: false,
    title: "lightsDisappear",
  };
  const modPanelDisclosure = useDisclosure(false);

  useEffect(() => {
    if (!roomId) return;
    connectToSocket(roomId);
  }, [roomId]);

  useEffect(() => {
    if (room.isClosed) {
      void router.push("/rooms");

      notifications.update({
        id: "closeRoom",
        title: "Raum geschlossen",
        message: "Der Raum wurde vom Moderator geschlossen.",
        loading: false,
        icon: <IconCheck size="1rem" />,
      });
    }
  }, [room.isClosed]);

  // Handle Sound Effects
  useEffect(() => {
    for (const [key, sound] of Object.entries(sounds)) {
      if (sound) {
        playAudio(key as unknown as keyof RoomSounds);
        sounds[key as unknown as keyof RoomSounds] = false;
      }
    }
  }, [Object.values(sounds)]);

  // Handle Music
  useEffect(() => {
    if (!room) return;

    if (musicState.isActive) {
      playMusic({ id: musicState.title });
    } else {
      pauseMusic();
    }

    return () => stopMusic();
  }, [musicState.isActive, musicState.title]);

  if (!room.isLoaded) {
    return <div>Loading ...</div>;
  }

  return (
    <Flex
      h="100vh"
      p={sizes.padding}
      pos="relative"
      direction="column"
    >
      <Flex
        h="100%"
        // align="center"
        // justify="center"
        direction="column"
      >
        <ModView>
          <Box
            pos="absolute"
            bottom="50%"
          >
            <ActionIcon
              variant="filled"
              toolTip="Mod-Panel öffnen"
            >
              <IconArrowRight onClick={modPanelDisclosure[1].open} />
            </ActionIcon>
          </Box>
          <ModPanel disclosure={modPanelDisclosure} />
        </ModView>
        <RoomHeader />
        <RoomBody />
        <RoomFooter />
      </Flex>
      {/* <GamesJSON games={room.games} /> */}
    </Flex>
  );
};

export default RoomUI;
