import { mergeTests } from "@playwright/test";
import { test as authTest } from "./auth";
import { test as cleanupTest } from "./cleanup";
import { test as multiplayerTest } from "./multiplayer";
import { test as pagesTest } from "./pages";
import { test as seededRoomTest } from "./seededRoom";

export const test = mergeTests(
  authTest,
  cleanupTest,
  pagesTest,
  multiplayerTest,
  seededRoomTest
);

export { expect } from "@playwright/test";
