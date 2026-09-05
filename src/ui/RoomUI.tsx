import { Box, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Confetti from "~/components/room/Confetti/Confetti";
import ModPanel from "~/components/room/ModPanel";
import RoomBody from "~/components/room/RoomBody";
import RoomFooter from "~/components/room/RoomFooter";
import RoomHeader from "~/components/room/RoomHeader";
import InteractiveModerationTour from "~/components/room/TutorialTours/InteractiveModerationTour";
import InteractivePlayerTour from "~/components/room/TutorialTours/InteractivePlayerTour";
import ActionIcon from "~/components/shared/ActionIcon";
import ModView from "~/components/shared/ModView";
import { connectToSocket } from "~/config/store";
import useAudio from "~/hooks/useAudio";
import useMusic from "~/hooks/useMusic";
import useSyncedRoom from "~/hooks/useSyncedRoom";
import { useUser } from "~/hooks/useUser";
import { sizes } from "~/styles/constants";
import type { RoomSounds } from "~/types/gameshow.types";

const RoomUI = () => {
  const params = useParams();
  const { playAudio } = useAudio();
  const { play: playMusic, stop: stopMusic, pause: pauseMusic } = useMusic();
  const roomId = params?.id as string;
  const router = useRouter();
  const { isPlayer } = useUser();

  const room = useSyncedRoom();
  const sounds = room.context?.audio.sounds ?? {};
  const rawMusicState = room.context?.audio.music;
  const musicState: { isActive: boolean; title: string } = {
    isActive:
      rawMusicState != null &&
      typeof rawMusicState === "object" &&
      "isActive" in rawMusicState
        ? Boolean((rawMusicState as { isActive: unknown }).isActive)
        : false,
    title:
      rawMusicState != null &&
      typeof rawMusicState === "object" &&
      "title" in rawMusicState
        ? String((rawMusicState as { title: unknown }).title)
        : "lightsDisappear"
  };

  // Ensure we have a valid title, fallback to lightsDisappear if empty
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
        icon: <IconCheck size="1rem" />
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
    if (!room.isLoaded) return;

    if (musicState.isActive) {
      playMusic();
    } else {
      pauseMusic();
    }

    return () => {
      if (musicState.isActive) {
        stopMusic();
      }
    };
  }, [room.isLoaded, musicState.isActive, playMusic, pauseMusic, stopMusic]);

  if (!room.isLoaded) {
    return <div>Loading ...</div>;
  }

  return (
    <>
      <Confetti />
      {isPlayer && <InteractivePlayerTour />}

      {/* Hidden Header. Just do display the first welcome step of the interactive tour */}
      <h1
        className="interactive-tour-header"
        style={{
          zIndex: -9999,
          // visibility: "hidden",

          position: "absolute",
          left: "50%",
          top: "35%",
          transform: "translate(-50%, -50%)"
        }}
      />

      <Flex h="100vh" p={sizes.padding} pos="relative" direction="column">
        <Flex
          h="100%"
          // align="center"
          // justify="center"
          direction="column"
        >
          <ModView>
            <InteractiveModerationTour
              openModPanel={modPanelDisclosure[1].open}
              // callback={handleInteractiveModerationTourCallback}
            />
            <Box pos="absolute" bottom="50%" className="mod-panel-btn">
              <ActionIcon variant="filled" toolTip="Mod-Panel öffnen">
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
    </>
  );
};

export default RoomUI;
