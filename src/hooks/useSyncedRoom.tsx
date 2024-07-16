import { useSyncedStore } from "@syncedstore/react";
import { roomStore } from "~/config/store";
import type { Room } from "~/types/gameshow.types";

const useSyncedRoom = () => {
  const { room } = useSyncedStore(roomStore) as unknown as {
    room: { state: Room };
  };

  // if (context === undefined) {
  //   throw Error("useSyncedRoom must be used within SyncedRoomProvider");
  // }

  return {
    ...room.state,
    isLoaded: !!room.state?.id,
    isClosed: room.state?.context.isClosed ?? false
  };
};

export default useSyncedRoom;
