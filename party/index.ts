import type * as Party from "partykit/server";
import { onConnect } from "y-partykit";
import {
  BUZZ_CLAIM_WINDOW_MS,
  decodeBuzzRequest,
  type TBuzzResult
} from "../src/config/buzzerProtocol";

export default class Server implements Party.Server {
  private claim: { teamId: string; at: number } | null = null;

  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection) {
    return onConnect(conn, this.room, { persist: { mode: "snapshot" } });
  }

  // Yjs traffic uses other binary message types; buzz requests are type 100.
  // Messages are handled one at a time, so the first press in a window wins.
  onMessage(
    message: string | ArrayBuffer | ArrayBufferView,
    sender: Party.Connection
  ) {
    if (typeof message === "string") return;

    const request = decodeBuzzRequest(message);
    if (!request) return;

    const now = Date.now();
    const isClaimOpen =
      this.claim !== null && now - this.claim.at < BUZZ_CLAIM_WINDOW_MS;
    const granted = !isClaimOpen || this.claim?.teamId === request.teamId;
    if (!isClaimOpen) this.claim = { teamId: request.teamId, at: now };

    const result: TBuzzResult = {
      type: "buzz-result",
      teamId: request.teamId,
      granted
    };
    sender.send(JSON.stringify(result));
  }
}

Server satisfies Party.Worker;
