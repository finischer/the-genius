import { createContext, useContext, useState } from "react";
import type Room from "~/pages/api/classes/Room/Room";
import {
  type TModeratorSettings,
  type INonNullableUseRoomContext,
  type IUseRoomContext,
  type IUseRoomProvider,
} from "./useRoom.types";

const RoomContext = createContext<IUseRoomContext | undefined>(undefined);

const RoomProvider: React.FC<IUseRoomProvider> = ({ children }) => {
  const [moderatorSettings, setModeratorSettings] = useState<TModeratorSettings>({
    showMediaPlayer: false,
  });
  const [room, setRoom] = useState<Room>();
  const currentGame = room?.games.find((g) => g.identifier === room?.currentGame);

  return (
    <RoomContext.Provider value={{ room, currentGame, setRoom, moderatorSettings }}>
      {children}
    </RoomContext.Provider>
  );
};

const useRoom = () => {
  const context = useContext(RoomContext);

  if (context === undefined) {
    throw Error("useRoom must be used within RoomProvider");
  }

  // room will not be undefined in other components except in room component
  // -> in room, we catch the case if room is undefined
  return context as INonNullableUseRoomContext;
};

export { RoomProvider, useRoom };
