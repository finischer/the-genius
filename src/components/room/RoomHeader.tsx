import { Box, Flex, Text, useMantineTheme } from "@mantine/core";
import Timer from "./Timer";
import { AnimatePresence, motion } from "framer-motion";
import { animations } from "~/utils/animations";
import useSyncedRoom from "~/hooks/useSyncedRoom";
import ContainerBox from "../shared/ContainerBox";
import { RoomView } from "~/types/gameshow.types";
import useBuzzer from "~/hooks/useBuzzer";
import { IconShare } from "@tabler/icons-react";
import ActionIcon from "../shared/ActionIcon";
import { useDisclosure } from "@mantine/hooks";
import RoomDetailsModal from "./RoomDetailsModal";

const RoomHeader = () => {
  const { buzzer } = useBuzzer();
  const room = useSyncedRoom();
  const theme = useMantineTheme();
  const [openedRoomDetails, { open: openRoomDetails, close: closeRoomDetails }] = useDisclosure(false);

  const currGame = room.context.currentGame;

  const showCurrGameBanner = room.context.view == RoomView.GAME && !!currGame;

  return (
    <Box
      h={125}
      w="100%"
      pos="relative"
    >
      <RoomDetailsModal
        room={room}
        openedModal={openedRoomDetails}
        onClose={closeRoomDetails}
      />

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

      <Flex
        w="100%"
        justify="center"
        pos="absolute"
        top={0}
      >
        <Timer />
      </Flex>

      {/* Current Game */}
      <AnimatePresence>
        {!!showCurrGameBanner && (
          <motion.div {...animations.fadeInOut}>
            <ContainerBox
              px="xl"
              py="md"
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
