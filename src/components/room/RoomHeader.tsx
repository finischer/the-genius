import { Box, Flex, Group, Text, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSettings, IconShare } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import useBuzzer from "~/hooks/useBuzzer";
import useSyncedRoom from "~/hooks/useSyncedRoom";
import { RoomView } from "~/types/gameshow.types";
import { animations } from "~/utils/animations";
import ActionIcon from "../shared/ActionIcon";
import ContainerBox from "../shared/ContainerBox";
import RoomDetailsModal from "./RoomDetailsModal";
import SettingsModal from "./SettingsModal/SettingsModal";
import Timer from "./Timer";

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

  const showCurrGameBanner =
    room.context.view == RoomView.GAME &&
    !!currGame &&
    room.context.display.game;

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
              onClick={() => buzzer({ withTimer: true })}
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
