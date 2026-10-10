import type * as Party from "partykit/server";
import { onConnect } from "y-partykit";
import {
  decodeBuzzRequest,
  type TBuzzStamp
} from "../src/config/buzzerProtocol";

export default class Server implements Party.Server {
  private seq = 0;

  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection) {
    return onConnect(conn, this.room, { persist: { mode: "snapshot" } });
  }

  // Yjs traffic uses other binary message types; buzz requests are type 100.
  // Messages are handled one at a time, so `seq` gives a strict arrival order
  // even when two presses land in the same millisecond.
  onMessage(message: string | ArrayBuffer | ArrayBufferView) {
    if (typeof message === "string") return;

    const parsed = decodeBuzzRequest(message);
    if (!parsed) return;

    const stamp: TBuzzStamp = {
      type: "buzz-stamp",
      teamId: parsed.teamId,
      serverTime: Date.now(),
      seq: ++this.seq
    };
    this.room.broadcast(JSON.stringify(stamp));
  }
}

Server satisfies Party.Worker;
