import net from "node:net";
import WebSocketImpl, { WebSocketServer, type WebSocket } from "ws";
import YProvider from "y-partyserver/provider";
import * as Y from "yjs";
import * as syncProtocol from "y-protocols/sync";
import * as encoding from "lib0/encoding";
import * as decoding from "lib0/decoding";

export const PARTYKIT_PORT = 1999;
const PROBE_TIMEOUT_MS = 1000;
const SEED_SYNC_TIMEOUT_MS = 5000;

export interface IPartykitMock {
  port: number;
  host: string;
  /** True when the Yjs mock was started, false when the real server is used. */
  isMock: boolean;
  close: () => Promise<void>;
  /** Pre-seed a room's Yjs document with an encoded state update. */
  seedRoom: (roomId: string, update: Uint8Array) => Promise<void>;
}

const isPortOpen = (port: number): Promise<boolean> =>
  new Promise((resolve) => {
    const socket = net.connect({ port, host: "127.0.0.1" });
    const done = (open: boolean) => {
      socket.destroy();
      resolve(open);
    };
    socket.setTimeout(PROBE_TIMEOUT_MS, () => done(false));
    socket.once("connect", () => done(true));
    socket.once("error", () => done(false));
  });

const seedRealServer = async (roomId: string, update: Uint8Array) => {
  const doc = new Y.Doc();
  Y.applyUpdate(doc, update);
  const provider = new YProvider(`localhost:${PARTYKIT_PORT}`, roomId, doc, {
    WebSocketPolyfill: WebSocketImpl as never,
    connect: true
  });
  try {
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error(`Seeding room ${roomId} timed out`)),
        SEED_SYNC_TIMEOUT_MS
      );
      provider.once("synced", () => {
        clearTimeout(timeout);
        resolve();
      });
    });
  } finally {
    provider.destroy();
    doc.destroy();
  }
};

/**
 * Provides a PartyKit endpoint on port 1999.
 * The real server is used whenever it is running. The Yjs mock is started
 * only as fallback when E2E_PARTYKIT=mock and nothing listens on the port.
 */
export async function startPartykitMock(): Promise<IPartykitMock> {
  if (await isPortOpen(PARTYKIT_PORT)) {
    return {
      port: PARTYKIT_PORT,
      host: `localhost:${PARTYKIT_PORT}`,
      isMock: false,
      close: () => Promise.resolve(),
      seedRoom: seedRealServer
    };
  }
  if (process.env.E2E_PARTYKIT !== "mock") {
    throw new Error(
      `PartyKit-Server nicht erreichbar (localhost:${PARTYKIT_PORT}). Server starten (bunx wrangler dev --port ${PARTYKIT_PORT}) oder E2E_PARTYKIT=mock setzen.`
    );
  }
  return startYjsMock(PARTYKIT_PORT);
}

async function startYjsMock(port: number): Promise<IPartykitMock> {
  const docs = new Map<string, Y.Doc>();
  const rooms = new Map<string, Set<WebSocket>>();

  const wss = new WebSocketServer({ port });

  const getOrCreateDoc = (roomId: string): Y.Doc => {
    if (!docs.has(roomId)) {
      docs.set(roomId, new Y.Doc());
      rooms.set(roomId, new Set());
    }
    return docs.get(roomId)!;
  };

  wss.on("connection", (ws, req) => {
    // Extract room ID from URL: /party/<roomId>
    const roomId = req.url?.split("/").pop() ?? "default";
    const doc = getOrCreateDoc(roomId);
    const clients = rooms.get(roomId)!;
    clients.add(ws);

    // Send Yjs Sync Step 1
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, 0); // messageSync
    syncProtocol.writeSyncStep1(encoder, doc);
    ws.send(encoding.toUint8Array(encoder));

    ws.on("message", (data: Buffer) => {
      const decoder = decoding.createDecoder(new Uint8Array(data));
      const messageType = decoding.readVarUint(decoder);

      if (messageType === 0) {
        // Sync message
        const replyEncoder = encoding.createEncoder();
        encoding.writeVarUint(replyEncoder, 0);
        const hasReply = syncProtocol.readSyncMessage(
          decoder,
          replyEncoder,
          doc,
          null
        );
        if (hasReply) ws.send(encoding.toUint8Array(replyEncoder));
        // Broadcast update to all other clients
        const updateEncoder = encoding.createEncoder();
        encoding.writeVarUint(updateEncoder, 0);
        syncProtocol.writeSyncStep2(updateEncoder, doc);
        const updateMsg = encoding.toUint8Array(updateEncoder);
        clients.forEach((client) => {
          if (client !== ws && client.readyState === client.OPEN)
            client.send(updateMsg);
        });
      } else if (messageType === 1) {
        // Awareness - forward to all other clients
        clients.forEach((client) => {
          if (client !== ws && client.readyState === client.OPEN)
            client.send(data);
        });
      }
    });

    ws.on("close", () => clients.delete(ws));
  });

  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error("PartyKit mock failed to start within 5 seconds")),
      5000
    );
    wss.on("listening", () => {
      clearTimeout(timeout);
      resolve();
    });
    wss.on("error", reject);
  });

  const seedRoom = (roomId: string, update: Uint8Array) => {
    const doc = getOrCreateDoc(roomId);
    Y.applyUpdate(doc, update);
    return Promise.resolve();
  };

  return {
    port,
    host: `localhost:${port}`,
    isMock: true,
    close: () =>
      new Promise((resolve, reject) =>
        wss.close((err) => (err ? reject(err) : resolve()))
      ),
    seedRoom
  };
}
