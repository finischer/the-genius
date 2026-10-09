import { useSyncedStore } from "@syncedstore/react";
import { getRoomStore } from "~/config/store";
import type { Room } from "~/types/gameshow.types";

const useSyncedRoom = () => {
  const { room } = useSyncedStore(getRoomStore()) as unknown as {
    room: { state: Room };
  };

  return {
    ...room.state,
    isLoaded: !!room.state?.id,
    isClosed: room.state?.context.isClosed ?? false,
    isDuellMode: room.state?.maxPlayersPerTeam === 1
  };
};

export default useSyncedRoom;
