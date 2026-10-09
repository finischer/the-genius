import { Box, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import Confetti from "~/compositions/room/Confetti/Confetti";
import ModPanel from "~/compositions/room/ModPanel";
import RoomBody from "~/compositions/room/RoomBody";
import RoomFooter from "~/compositions/room/RoomFooter";
import RoomHeader from "~/compositions/room/RoomHeader";
import InteractiveModerationTour from "~/compositions/room/TutorialTours/InteractiveModerationTour";
import InteractivePlayerTour from "~/compositions/room/TutorialTours/InteractivePlayerTour";
import ActionIcon from "~/components/ActionIcon";
import ModView from "~/compositions/ModView";
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
  const playedSoundsRef = useRef<Record<string, string> | null>(null);
  const router = useRouter();
  const { isPlayer, isHost } = useUser();

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
  // Each trigger writes a unique nonce. Every client plays a sound locally when
  // the nonce changes, so no client has to reset shared state (which would
  // swallow the event for the others).
  useEffect(() => {
    if (!room.isLoaded) return;

    const isInitialRun = playedSoundsRef.current === null;
    const played = playedSoundsRef.current ?? {};

    for (const [key, nonce] of Object.entries(sounds)) {
      if (!nonce || played[key] === nonce) continue;
      played[key] = nonce;
      if (!isInitialRun) playAudio(key as keyof RoomSounds);
    }

    playedSoundsRef.current = played;
  }, [room.isLoaded, Object.values(sounds).join("|")]);

  // Simultaneous presses merge into multiple active teams (CRDT). The host
  // picks one winner (earliest press, team id as tie-break) and resets the rest.
  const activeTeamsKey = room.isLoaded
    ? Object.values(room.teams)
        .filter((t) => t.isActiveTurn)
        .map((t) => t.id)
        .join("|")
    : "";
  useEffect(() => {
    if (!isHost || !room.isLoaded) return;

    const activeTeams = Object.values(room.teams).filter((t) => t.isActiveTurn);
    if (activeTeams.length < 2) return;

    const [winner, ...losers] = [...activeTeams].sort(
      (a, b) =>
        (a.buzzer.pressedAt ?? Infinity) - (b.buzzer.pressedAt ?? Infinity) ||
        a.id.localeCompare(b.id)
    );
    if (!winner) return;

    losers.forEach((team) => {
      team.isActiveTurn = false;
      team.buzzer.isPressed = false;
      team.buzzer.playersBuzzered = [];
      team.scorebarTimer.active = false;
      team.scorebarTimer.currSeconds = team.scorebarTimer.initSeconds;
    });
  }, [isHost, room.isLoaded, activeTeamsKey]);

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
              <ActionIcon
                variant="filled"
                toolTip="Mod-Panel öffnen"
                data-testid="mod-panel-btn"
                onClick={modPanelDisclosure[1].open}
              >
                <IconArrowRight />
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
