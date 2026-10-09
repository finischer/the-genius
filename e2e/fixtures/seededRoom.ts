import { mergeTests, type APIRequestContext } from "@playwright/test";
import {
  startPartykitMock,
  type IPartykitMock
} from "../helpers/partykit-mock";
import {
  buildRoomState,
  encodeRoomState,
  type IRoomStateOptions
} from "../helpers/roomState";
import { createGameshowViaApi } from "../helpers/trpc";
import { createE2eName } from "../support/names";
import { test as authTest } from "./auth";
import { test as cleanupTest } from "./cleanup";

export interface ISeededRoom {
  gameshowId: string;
  roomId: string;
}

export type TSeedRoom = (
  games: readonly unknown[],
  options?: IRoomStateOptions
) => Promise<ISeededRoom>;

async function getSessionUserId(request: APIRequestContext): Promise<string> {
  const response = await request.get("/api/auth/session");
  const session = (await response.json()) as { user?: { id?: string } };
  const id = session.user?.id;
  if (!id) throw new Error("Worker-Session enthält keine User-ID");
  return id;
}

type SeededRoomFixtures = {
  seedRoom: TSeedRoom;
};

/**
 * Creates a gameshow with the given games and a room whose Yjs state is
 * pre-seeded in PartyKit. All created resources are tracked for cleanup.
 */
export const test = mergeTests(
  authTest,
  cleanupTest
).extend<SeededRoomFixtures>({
  seedRoom: async ({ workerSession, tracker }, use) => {
    const mocks: IPartykitMock[] = [];

    await use(async (games, options) => {
      const mock = await startPartykitMock();
      mocks.push(mock);

      const gameshow = await createGameshowViaApi(workerSession.request, {
        name: createE2eName(),
        games: [...games]
      });
      tracker.trackGameshow(gameshow.id);

      const roomId = createE2eName();
      const creatorId =
        options?.creatorId ?? (await getSessionUserId(workerSession.request));
      await mock.seedRoom(
        roomId,
        encodeRoomState(
          buildRoomState(roomId, createE2eName(), games, {
            ...options,
            creatorId
          })
        )
      );

      const response = await workerSession.request.post(
        "/api/trpc/rooms.addRoom",
        {
          data: { json: { id: roomId } },
          headers: { "Content-Type": "application/json" }
        }
      );
      if (!response.ok()) {
        throw new Error(
          `tRPC rooms.addRoom fehlgeschlagen: ${response.status()} ${await response.text()}`
        );
      }
      tracker.trackRoom(roomId);

      return { gameshowId: gameshow.id, roomId };
    });

    await Promise.allSettled(mocks.map((mock) => mock.close()));
  }
});

export { expect } from "@playwright/test";
