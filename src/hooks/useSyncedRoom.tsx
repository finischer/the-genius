import { useContext } from "react";
import { SyncedRoomContext } from "~/context/SyncedRoomContext";

const useSyncedRoom = () => {
  const context = useContext(SyncedRoomContext);

  if (context === undefined) {
    throw Error("useSyncedRoom must be used within SyncedRoomProvider");
  }

  return context;
};

export default useSyncedRoom;
