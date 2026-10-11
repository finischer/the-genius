import {
  mergeTests,
  type APIRequestContext,
  type BrowserContext,
  type Page
} from "@playwright/test";
import WebSocket from "ws";

import {
  startPartykitMock,
  type IPartykitMock
} from "../helpers/partykit-mock";
import { buildRoomState, encodeRoomState } from "../helpers/roomState";
import { createGameshowViaApi } from "../helpers/trpc";
import { createE2eName } from "../support/names";
import { assertPlayerCount } from "../support/players";
import { blockExternalServices, test as authTest } from "./auth";
import { test as cleanupTest } from "./cleanup";
import { RoomPage } from "../pages/RoomPage";

const PARTYKIT_HOST = "localhost:1999";
const PARTYKIT_PREFLIGHT_TIMEOUT_MS = 5_000;

export interface IRoomPlayer {
  username: string;
  context: BrowserContext;
  page: Page;
  roomPage: RoomPage;
}

export interface IRoomWithPlayers {
  gameshowId: string;
  roomId: string;
  host: { page: Page; roomPage: RoomPage };
  players: IRoomPlayer[];
}

export interface ICreateRoomOptions {
  games?: readonly unknown[];
  maxPlayersPerTeam?: number;
}
export type TCreateRoomWithPlayers = (
  n: number,
  options?: ICreateRoomOptions
) => Promise<IRoomWithPlayers>;

type MultiplayerFixtures = {
  createRoomWithPlayers: TCreateRoomWithPlayers;
};

/**
 * Opens a WebSocket against the PartyKit endpoint. Any accepted upgrade proves
 * the server is up; failure or timeout raises a descriptive error.
 */
export async function assertPartykitReachable(
  host: string = PARTYKIT_HOST,
  timeoutMs: number = PARTYKIT_PREFLIGHT_TIMEOUT_MS
): Promise<void> {
  const error = new Error(`PartyKit-Server nicht erreichbar (${host})`);
  await new Promise<void>((resolve, reject) => {
    const socket = new WebSocket(
      `ws://${host}/parties/main/${createE2eName()}`
    );
    const timer = setTimeout(() => {
      socket.terminate();
      reject(error);
    }, timeoutMs);
    socket.once("open", () => {
      clearTimeout(timer);
      socket.close();
      resolve();
    });
    socket.once("error", () => {
      clearTimeout(timer);
      socket.terminate();
      reject(error);
    });
  });
}

async function getSessionUserId(request: APIRequestContext): Promise<string> {
  const response = await request.get("/api/auth/session");
  const session = (await response.json()) as { user?: { id?: string } };
  const id = session.user?.id;
  if (!id) throw new Error("Host-Session enthält keine User-ID");
  return id;
}
async function addRoomViaApi(
  request: APIRequestContext,
  roomId: string
): Promise<void> {
  const response = await request.post("/api/trpc/rooms.addRoom", {
    data: { json: { id: roomId } },
    headers: { "Content-Type": "application/json" }
  });
  if (!response.ok()) {
    throw new Error(
      `tRPC rooms.addRoom fehlgeschlagen: ${response.status()} ${await response.text()}`
    );
  }
}

export const test = mergeTests(
  authTest,
  cleanupTest
).extend<MultiplayerFixtures>({
  createRoomWithPlayers: async (
    { browser, baseURL, workerUser, tracker },
    use
  ) => {
    const contexts: BrowserContext[] = [];

    const mocks: IPartykitMock[] = [];
    const create: TCreateRoomWithPlayers = async (n, options = {}) => {
      assertPlayerCount(n);
      await assertPartykitReachable();

      const hostContext = await browser.newContext({
        baseURL,
        storageState: workerUser.storageState
      });
      contexts.push(hostContext);
      await blockExternalServices(hostContext);

      const games = [...(options.games ?? [])];
      const gameshow = await createGameshowViaApi(hostContext.request, {
        name: createE2eName(),
        games
      });
      tracker.trackGameshow(gameshow.id);

      const roomId = createE2eName();
      const hostUserId = await getSessionUserId(hostContext.request);
      const mock = await startPartykitMock();
      mocks.push(mock);
      await mock.seedRoom(
        roomId,
        encodeRoomState(
          buildRoomState(roomId, createE2eName(), games, {
            creatorId: hostUserId,
            maxPlayersPerTeam: options.maxPlayersPerTeam
          })
        )
      );
      await addRoomViaApi(hostContext.request, roomId);
      tracker.trackRoom(roomId);

      const hostPage = await hostContext.newPage();
      const hostRoom = new RoomPage(hostPage);
      await hostRoom.goto(roomId);
      await hostRoom.waitForRoomLoaded();

      const players: IRoomPlayer[] = [];
      for (let i = 1; i <= n; i++) {
        const context = await browser.newContext({ baseURL });
        contexts.push(context);
        await blockExternalServices(context);
        const page = await context.newPage();
        const roomPage = new RoomPage(page);
        const username = `e2e-player-${i}`;
        await roomPage.goto(roomId);
        await roomPage.joinAsGuest(username);
        await roomPage.guestDialog.waitFor({ state: "hidden" });
        await roomPage.waitForRoomLoaded();
        players.push({ username, context, page, roomPage });
      }

      return {
        gameshowId: gameshow.id,
        roomId,
        host: { page: hostPage, roomPage: hostRoom },
        players
      };
    };

    await use(create);

    await Promise.allSettled(contexts.map((context) => context.close()));
    await Promise.allSettled(mocks.map((mock) => mock.close()));
  }
});

export { expect } from "@playwright/test";
