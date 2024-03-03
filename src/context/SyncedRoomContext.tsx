import type { RoomViews } from "@prisma/client";
import { filterArray } from "@syncedstore/core";
import { useSyncedStore } from "@syncedstore/react";
import React, { useState } from "react";
import type { Games } from "~/components/room/Game/games/game.types";
import { initPlayer, roomStore } from "~/config/store";
import type { Room } from "~/types/gameshow.types";

interface SyncedRoomContextProps extends Room {
  isLoaded: boolean;
}

export const SyncedRoomContext = React.createContext<SyncedRoomContextProps | undefined>(undefined);

const SyncedRoomProvider = ({ children }: { children: React.ReactNode }) => {
  const { room } = useSyncedStore(roomStore) as unknown as { room: { state: Room } };

  const startGame = (gameIdentifier: Games) => {};

  const changeView = (newView: RoomViews) => {};

  return (
    <SyncedRoomContext.Provider
      value={{
        ...room.state,
        isLoaded: !!room.state?.id,
      }}
    >
      {children}
    </SyncedRoomContext.Provider>
  );
};

export default SyncedRoomProvider;
