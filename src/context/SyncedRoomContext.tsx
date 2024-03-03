import type { RoomViews } from "@prisma/client";
import { filterArray } from "@syncedstore/core";
import { useSyncedStore } from "@syncedstore/react";
import React, { useState } from "react";
import type { Games } from "~/components/room/Game/games/game.types";
import { initPlayer, roomStore } from "~/config/store";
import type { Room } from "~/types/gameshow.types";

interface SyncedRoomContextProps extends Room {
  isLoaded: boolean;
  startTimer: () => void;
  incrementCount: () => void;
}

export const SyncedRoomContext = React.createContext<SyncedRoomContextProps | undefined>(undefined);

const SyncedRoomProvider = ({ children }: { children: React.ReactNode }) => {
  const { room } = useSyncedStore(roomStore) as unknown as { room: { state: Room } };

  const incrementCount = () => {
    room.state.counter += 1;
  };

  const startTimer = () => {
    console.log("Interval ID: ", room.state.intervalId);
    if (room.state.intervalId) {
      clearInterval(room.state.intervalId);
      room.state.intervalId = null;
      room.state.counter = 0;
    }

    const id = setInterval(() => {
      incrementCount();
    }, 1000);

    room.state.intervalId = id;
  };

  const startGame = (gameIdentifier: Games) => {};

  const changeView = (newView: RoomViews) => {};

  return (
    <SyncedRoomContext.Provider
      value={{
        ...room.state,
        isLoaded: !!room.state?.id,
        incrementCount,
        startTimer,
      }}
    >
      {children}
    </SyncedRoomContext.Provider>
  );
};

export default SyncedRoomProvider;
