import {
  Box,
  Center,
  Container,
  Flex,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure, useNetwork } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconArrowRight,
  IconInfoSmall,
  IconWifi,
  IconWifi0,
  IconWifi1,
  IconWifi2,
  IconWifiOff,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import AnswerBanner from "~/components/room/AnswerBanner/AnswerBanner";
import Game from "~/components/room/Game";
import ModPanel from "~/components/room/ModPanel/ModPanel";
import RoomDetailsModal from "~/components/room/RoomDetailsModal/RoomDetailsModal";
import Scorebar from "~/components/room/Scorebar/Scorebar";
import Scoreboard from "~/components/room/Scoreboard/Scoreboard";
import Timer from "~/components/room/Timer/Timer";
import ActionIcon from "~/components/shared/ActionIcon";
import ContainerBox from "~/components/shared/ContainerBox";
import GameRulesModal from "~/components/shared/GameRulesModal/GameRulesModal";
import Loader from "~/components/shared/Loader/Loader";
import useBuzzer from "~/hooks/useBuzzer/useBuzzer";
import useNotification from "~/hooks/useNotification";
import { useRoom } from "~/hooks/useRoom";
import { socket } from "~/hooks/useSocket";
import { useUser } from "~/hooks/useUser";
import { sizes } from "~/styles/constants";
import { type TUserReduced } from "~/types/socket.types";
import { animations } from "~/utils/animations";
import type Room from "../api/classes/Room/Room";
import ModView from "~/components/shared/ModView";

type TNetworkStatusEffectiveType = "slow-2g" | "2g" | "3g" | "4g";

const NETWORK_STATUS_ICON_MAP: {
  [key in TNetworkStatusEffectiveType]: React.ReactNode;
} = {
  "slow-2g": <IconWifi0 color="red" />,
  "2g": <IconWifi1 color="orange" />,
  "3g": <IconWifi2 color="yellow" />,
  "4g": <IconWifi color="green" />,
};

const RoomPage = () => {
  const theme = useMantineTheme();
  const { showInfoNotification } = useNotification();
  const router = useRouter();
  const { data: session } = useSession();
  const [
    openedRoomDetails,
    { open: openRoomDetails, close: closeRoomDetails },
  ] = useDisclosure(false);
  const [openedGameRules, { close: closeGameRules }] = useDisclosure();

  const { room, currentGame, setRoom } = useRoom();
  const { isHost } = useUser();
  const { buzzer } = useBuzzer();
  const modPanelDisclosure = useDisclosure(false);
  const networkStatus = useNetwork();

  const showGame = room?.state.display.game;
  const showCurrentGameCornerBanner =
    currentGame && room.state.view === "GAME" && showGame;
  const roomId = router.query.id as string;

  // useEffect(() => {
  //     // show info banner that no sounds/music are available until we have a license to use it
  //     notifications.show({
  //         title: "Info",
  //         message: "Aus Lizenzgründen stehen Sounds/Musik aktuell nicht zur Verfügung",
  //         color: "orange",
  //         icon: <IconAlertCircle size="1rem" />,
  //         autoClose: false,
  //     })
  // }, [])

  useEffect(() => {
    if (session?.user) {
      const user: TUserReduced = {
        id: session.user.id,
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image || null,
        role: session.user.role,
        username: session.user.username || "",
      };

      socket.emit("joinRoom", { user, roomId }, (room: Room) => {
        setRoom(room);
      });

      socket.on("userLeftRoom", ({ user }) => {
        notifications.show({
          message: `${user?.name || ""} hat den Raum verlassen`,
        });
      });

      socket.on("updateRoom", ({ newRoomState }) => {
        setRoom(newRoomState);
      });

      socket.on("roomWasClosed", () => {
        showInfoNotification({
          message: "Raum wurde geschlossen",
        });
        void router.push("/rooms");
      });

      socket.on("raiseException", ({ msg, reason }) => {
        if (reason === "noRoomException") {
          showInfoNotification({
            message: "Raum wurde nicht gefunden",
          });
          void router.push("/rooms");
        }
      });
    }

    return () => {
      socket.removeAllListeners();
    };
  }, [session]);

  if (room === undefined) {
    return (
      <Center h="100vh">
        <Loader message="Raum wird geladen ..." />
      </Center>
    );
  }

  return (
    <>
      {/* Modals */}
      <RoomDetailsModal
        room={room}
        openedModal={openedRoomDetails}
        onClose={closeRoomDetails}
      />
      {currentGame && (
        <GameRulesModal
          gameName={currentGame.name}
          onClose={closeGameRules}
          opened={openedGameRules}
          rules={currentGame.rules}
        />
      )}

      <Flex
        h="100vh"
        p={sizes.padding}
        pos="relative"
        direction="column"
      >
        {/* Moderation Buttons */}
        <ModView>
          <Box
            pos="absolute"
            bottom="50%"
          >
            <ActionIcon
              variant="filled"
              toolTip="Spiele anzeigen"
            >
              <IconArrowRight onClick={modPanelDisclosure[1].open} />
            </ActionIcon>
          </Box>
          <ModPanel disclosure={modPanelDisclosure} />
        </ModView>

        {/* Header */}
        <Container
          size="100%"
          w="100%"
          pos="relative"
        >
          {/* Top Left Corner */}
          <Flex
            align="center"
            gap="sm"
          >
            {/* Room Info Button */}
            <ActionIcon
              color={theme.primaryColor}
              size="xl"
              radius="xl"
              variant="filled"
              onClick={openRoomDetails}
            >
              <IconInfoSmall size="3.25rem" />
            </ActionIcon>
            {/* Connection status */}
            {!networkStatus.online && <IconWifiOff />}
            {networkStatus.online &&
              networkStatus.effectiveType &&
              NETWORK_STATUS_ICON_MAP[networkStatus.effectiveType]}
            {networkStatus.rtt}
          </Flex>

          {/* Top Middle */}
          <Flex
            w="100%"
            justify="center"
            pos="absolute"
            top={0}
          >
            <Timer />
          </Flex>
          {/* Top Right Corner */}
          {/* Current Game */}
          <AnimatePresence>
            {showCurrentGameCornerBanner && (
              <motion.div {...animations.fadeInOut}>
                <ContainerBox
                  px="xl"
                  bg={theme.primaryColor}
                  pos="absolute"
                  h="100%"
                  right={0}
                  top={0}
                  contentCentered
                  withShadow
                  onClick={buzzer}
                >
                  <Text>{currentGame.name}</Text>
                </ContainerBox>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>

        {/* Main View */}
        <Flex
          h="100%"
          align="center"
          justify="center"
          direction="column"
        >
          {currentGame && room.state.view === "GAME" && (
            <Game game={currentGame} />
          )}
          <AnimatePresence>
            {room.state.view === "SCOREBOARD" && (
              <motion.div {...animations.fadeInOut}>
                <Flex
                  direction="column"
                  gap="xl"
                >
                  <Scoreboard
                    team={room.teams.teamOne}
                    color="green"
                  />
                  <Scoreboard
                    team={room.teams.teamTwo}
                    color="red"
                  />
                </Flex>
              </motion.div>
            )}
          </AnimatePresence>
        </Flex>

        {/* Footer View */}
        <Flex
          justify="space-between"
          align="flex-end"
        >
          <Scorebar
            team={room.teams.teamOne}
            timerPosition="right"
          />
          <AnswerBanner
            answer={room.state.answerState.answer}
            size="l"
            showAnswer={room.state.answerState.showAnswer}
            mx="xl"
          />
          <Scorebar
            team={room.teams.teamTwo}
            timerPosition="left"
          />
        </Flex>
      </Flex>
    </>
  );
};

export default RoomPage;
