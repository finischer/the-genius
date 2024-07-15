import { useSyncedStore } from "@syncedstore/react";
import React from "react";
import { roomStore } from "~/config/store";
import type { Room } from "~/types/gameshow.types";

interface SyncedRoomContextProps extends Room {
  isLoaded: boolean;
}

export const SyncedRoomContext = React.createContext<
  SyncedRoomContextProps | undefined
>(undefined);

const SyncedRoomProvider = ({ children }: { children: React.ReactNode }) => {
  const { room } = useSyncedStore(roomStore) as unknown as {
    room: { state: Room };
  };

  // const startGame = (gameIdentifier: Game) => {};

  // const changeView = (newView: RoomViews) => {};

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
