import { Box, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowRight } from "@tabler/icons-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import ModPanel from "~/components/room/ModPanel";
import RoomBody from "~/components/room/RoomBody";
import RoomFooter from "~/components/room/RoomFooter";
import RoomHeader from "~/components/room/RoomHeader";
import ActionIcon from "~/components/shared/ActionIcon";
import GamesJSON from "~/components/shared/GamesJSON";
import ModView from "~/components/shared/ModView";
import { connectToSocket } from "~/config/store";
import useSyncedRoom from "~/hooks/useSyncedRoom";
import { sizes } from "~/styles/constants";

const RoomUI = () => {
  const params = useParams();

  const roomId = params?.id as string;

  const room = useSyncedRoom();
  const modPanelDisclosure = useDisclosure(false);

  useEffect(() => {
    if (!roomId) return;
    connectToSocket(roomId);
  }, [roomId]);

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
      <GamesJSON games={room.games} />
    </Flex>
  );
};

export default RoomUI;
