import { test as authTest } from "./auth";

type RoomFixtures = {
  roomContext: {
    gameshowId: string;
    roomId: string;
    roomUrl: string;
  };
};

/**
 * Generates a simple random ID matching the format used by @mantine/hooks randomId()
 * Format: mantine-<random alphanumeric>
 */
function generateRoomId(): string {
  return `e2e-${Math.random().toString(36).slice(2, 10)}`;
}

export const test = authTest.extend<RoomFixtures>({
  roomContext: async ({ authenticatedContext }, use) => {
    // Create gameshow via tRPC endpoint (SuperJSON-wrapped body)
    const gameshowRes = await authenticatedContext.request.post(
      "/api/trpc/gameshows.create",
      {
        data: { json: { name: "E2E Test Gameshow", games: [] } },
        headers: { "Content-Type": "application/json" }
      }
    );
    if (!gameshowRes.ok()) {
      throw new Error(`Gameshow creation failed: ${gameshowRes.status()}`);
    }

    const gameshowData = (await gameshowRes.json()) as {
      result: { data: { json: { id: string } } };
    };
    const gameshowId = gameshowData.result.data.json.id;

    // Generate a room ID and register it via rooms.addRoom
    const roomId = generateRoomId();
    const roomRes = await authenticatedContext.request.post(
      "/api/trpc/rooms.addRoom",
      {
        data: { json: { id: roomId } },
        headers: { "Content-Type": "application/json" }
      }
    );
    if (!roomRes.ok()) {
      throw new Error(`Room creation failed: ${roomRes.status()}`);
    }

    await use({ gameshowId, roomId, roomUrl: `/room/${roomId}` });

    // Cleanup: remove active room record and delete the gameshow
    await authenticatedContext.request.post("/api/trpc/rooms.removeActiveRoom", {
      data: { json: { roomId } },
      headers: { "Content-Type": "application/json" }
    });
    await authenticatedContext.request.post(
      "/api/trpc/gameshows.delete",
      {
        data: { json: { gameshowId } },
        headers: { "Content-Type": "application/json" }
      }
    );
  }
});

export { expect } from "@playwright/test";
