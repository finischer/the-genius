import { mergeTests } from "@playwright/test";
import { test as authTest } from "./auth";
import { test as roomTest } from "./room";
import { test as roomWithGamesTest } from "./roomWithGames";
import { test as roomWithAllGamesTest } from "./roomWithAllGames";

export const test = mergeTests(
  authTest,
  roomTest,
  roomWithGamesTest,
  roomWithAllGamesTest
);
export { expect } from "@playwright/test";
