import { ScrollArea, Text, Title } from "@mantine/core";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import SyncedRoomProvider from "~/context/SyncedRoomContext";
import { connectToSocket } from "~/config/store";
import { useUser } from "~/hooks/useUser";
import useSyncedRoom from "~/hooks/useSyncedRoom";
import ModPanelContent from "~/components/room/ModPanel/ModPanelContent";

const ModPanelInner = () => {
  const params = useParams();
  const roomId = params?.id as string;
  const { isHost } = useUser();
  const room = useSyncedRoom();

  useEffect(() => {
    if (!roomId) return;
    connectToSocket(roomId);
  }, [roomId]);

  if (!room.isLoaded) {
    return <Text p="md">Verbinde...</Text>;
  }

  if (!isHost) {
    return (
      <Text p="md" c="red">
        Kein Zugriff. Nur der Moderator darf das Mod-Panel öffnen.
      </Text>
    );
  }

  return (
    <ScrollArea h="100vh" p="md">
      <Title order={2} mb="md">
        Mod-Panel
      </Title>
      <ModPanelContent />
    </ScrollArea>
  );
};

const ModPanelPage = () => {
  return (
    <SyncedRoomProvider>
      <ModPanelInner />
    </SyncedRoomProvider>
  );
};

export default ModPanelPage;
