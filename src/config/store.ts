import { getYjsValue, syncedStore } from "@syncedstore/core";
import { WebsocketProvider } from "y-partykit/provider";
import Room from "~/classes/Room";

export type RoomStore = {
  state: Room;
};

export const roomStore = syncedStore({
  room: {} as RoomStore,
});

export const connectToSocket = (roomId: string) => {
  if (!roomId) return;
  new WebsocketProvider("wss://yjs.threepointone.partykit.dev/party", roomId, getYjsValue(roomStore) as any); // sync via partykit
};
