import { WebSocketServer, type WebSocket } from "ws";
import * as Y from "yjs";
import * as syncProtocol from "y-protocols/sync";
import * as encoding from "lib0/encoding";
import * as decoding from "lib0/decoding";

export interface IPartykitMock {
  port: number;
  host: string;
  close: () => Promise<void>;
  /** Pre-seed a room's Yjs document with an encoded state update. */
  seedRoom: (roomId: string, update: Uint8Array) => void;
}

export async function startPartykitMock(
  port = 1999
): Promise<IPartykitMock> {
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
      () =>
        reject(
          new Error("PartyKit mock failed to start within 5 seconds")
        ),
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
  };

  return {
    port,
    host: `localhost:${port}`,
    close: () =>
      new Promise((resolve, reject) =>
        wss.close((err) => (err ? reject(err) : resolve()))
      ),
    seedRoom
  };
}
