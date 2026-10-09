import { useSyncedStore } from "@syncedstore/react";
import React from "react";
import { getRoomStore } from "~/config/store";
import type { Room } from "~/types/gameshow.types";

interface SyncedRoomContextProps extends Room {
  isLoaded: boolean;
}

export const SyncedRoomContext = React.createContext<
  SyncedRoomContextProps | undefined
>(undefined);

const SyncedRoomProvider = ({ children }: { children: React.ReactNode }) => {
  const { room } = useSyncedStore(getRoomStore()) as unknown as {
    room: { state: Room };
  };

  return (
    <SyncedRoomContext.Provider
      value={{
        ...room.state,
        isLoaded: !!room.state?.id
      }}
    >
      {children}
    </SyncedRoomContext.Provider>
  );
};

export default SyncedRoomProvider;
