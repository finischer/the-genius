import { routePartykitRequest, type Connection } from "partyserver";
import { YServer } from "y-partyserver";
import * as Y from "yjs";
import {
  BUZZ_CLAIM_WINDOW_MS,
  parseBuzzRequest,
  type TBuzzResult
} from "../src/config/buzzerProtocol";

const DOC_STORAGE_KEY = "doc";

// Bound as "Main" in wrangler.jsonc, which maps to /parties/main/:room
export class Main extends YServer {
  static callbackOptions = { debounceWait: 1000, debounceMaxWait: 5000 };

  private claim: { teamId: string; at: number } | null = null;

  async onLoad() {
    const stored = await this.ctx.storage.get<Uint8Array>(DOC_STORAGE_KEY);
    if (stored) Y.applyUpdate(this.document, stored);
  }

  async onSave() {
    await this.ctx.storage.put(
      DOC_STORAGE_KEY,
      Y.encodeStateAsUpdate(this.document)
    );
  }

  // Messages are handled one at a time, so the first press in a window wins.
  onCustomMessage(connection: Connection, message: string) {
    const request = parseBuzzRequest(message);
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
    this.sendCustomMessage(connection, JSON.stringify(result));
  }
}

type Env = { Main: DurableObjectNamespace<Main> };

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return (
      (await routePartykitRequest(request, env)) ??
      new Response("Not Found", { status: 404 })
    );
  }
} satisfies ExportedHandler<Env>;
