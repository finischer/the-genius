import { Box, Flex, Group, Text, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconSettings, IconShare } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import useBuzzer from "~/hooks/useBuzzer";
import useSyncedRoom from "~/hooks/useSyncedRoom";
import useNotification from "~/hooks/useNotification";
import { RoomView } from "~/types/gameshow.types";
import { animations } from "~/utils/animations";
import { GAME_STATE_MAP } from "~/games/core/games.config";
import { Game } from "~/games/core/types";
import { assignObjectKeyByKey } from "~/utils/helpers";
import ActionIcon from "../shared/ActionIcon";
import ContainerBox from "../shared/ContainerBox";
import RoomDetailsModal from "./RoomDetailsModal";
import SettingsModal from "./SettingsModal/SettingsModal";
import Timer from "./Timer";
import { useUser } from "~/hooks/useUser";

const RoomHeader = () => {
  const { buzzer } = useBuzzer();
  const room = useSyncedRoom();
  const theme = useMantineTheme();
  const [
    openedRoomDetails,
    { open: openRoomDetails, close: closeRoomDetails }
  ] = useDisclosure(false);
  const [openedSettings, { open: openSettings, close: closeSettings }] =
    useDisclosure(false);
  const currGame = room.context.currentGame;
  const { isHost } = useUser();
  const { showErrorNotification } = useNotification();
  const showCurrGameBanner =
    room.context.view == RoomView.GAME &&
    !!currGame &&
    room.context.display.game;

  const resetCurrentGame = () => {
    if (!currGame) return;

    const defaultState = GAME_STATE_MAP[currGame.identifier];

    if (defaultState === undefined) {
      showErrorNotification({
        title: "Fehler",
        message:
          "Kein Standard-Zustand für dieses Spiel gefunden. Reset nicht möglich."
      });
      return;
    }

    assignObjectKeyByKey(
      defaultState as unknown as Record<string, unknown>,
      room.context.currentGame as unknown as Record<string, unknown>
    );

    room.teams.teamOne.gameScore = 0;
    room.teams.teamTwo.gameScore = 0;

    room.context.display.game = false;
    setTimeout(() => {
      room.context.display.gameIntro = true;
    }, 500);

    room.context.answerState.isAnswerDisplayed = false;
    room.context.answerState.answer = "";

    for (const team of Object.values(room.teams)) {
      team.isActiveTurn = false;
      team.buzzer.isPressed = false;
      team.buzzer.playersBuzzered = [];
    }
  };

  const ShareButton = () => (
    <ActionIcon
      color={theme.primaryColor}
      size="xl"
      radius="xl"
      variant="filled"
      onClick={openRoomDetails}
      toolTip="Teilen"
    >
      <IconShare size="1.5rem" />
    </ActionIcon>
  );

  const SettingsButton = () => {
    return (
      <ActionIcon
        color={theme.primaryColor}
        size="xl"
        radius="xl"
        variant="filled"
        onClick={openSettings}
        toolTip="Einstellungen"
        className="room-settings-btn"
      >
        <IconSettings size="1.5rem" />
      </ActionIcon>
    );
  };

  // Games that manage their own buzzer: RoomHeader fires a named custom event
  // instead of the standard useBuzzer flow. The game listens and handles it.
  const GAME_BUZZ_EVENTS: Partial<Record<Game, string>> = {
    [Game.FRAGENHAGEL]: "fragenhagel-buzz"
  };

  const handleClickOnCurrentGame = () => {
    if (isHost) {
      modals.openConfirmModal({
        title: "Spiel zurücksetzen?",
        children: (
          <Text size="sm">
            Das aktuelle Spiel wird vollständig zurückgesetzt. Diese Aktion kann
            nicht rückgängig gemacht werden.
          </Text>
        ),
        labels: { confirm: "Zurücksetzen", cancel: "Abbrechen" },
        confirmProps: { color: "red" },
        onConfirm: resetCurrentGame,
        onCancel: () => {}
      });
      return;
    }

    if (currGame && currGame.identifier in GAME_BUZZ_EVENTS) {
      const eventName = GAME_BUZZ_EVENTS[currGame.identifier];
      if (eventName) window.dispatchEvent(new Event(eventName));
      return;
    }

    buzzer({ withTimer: true });
  };

  return (
    <Box h={125} w="100%" pos="relative">
      <RoomDetailsModal
        room={room}
        openedModal={openedRoomDetails}
        onClose={closeRoomDetails}
      />

      <SettingsModal openedModal={openedSettings} onClose={closeSettings} />

      <Group>
        <ShareButton />
        <SettingsButton />
      </Group>

      <Flex w="100%" justify="center" pos="absolute" top={0}>
        <Timer />
      </Flex>

      {/* Current Game */}
      <AnimatePresence>
        {!!showCurrGameBanner && (
          <motion.div {...animations.fadeInOut}>
            <ContainerBox
              px="xl"
              py="sm"
              bg={theme.primaryColor}
              pos="absolute"
              right={0}
              top={0}
              contentCentered
              withShadow
              onClick={handleClickOnCurrentGame}
              className="game-reset-banner"
            >
              <Text>{currGame.name}</Text>
            </ContainerBox>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default RoomHeader;
