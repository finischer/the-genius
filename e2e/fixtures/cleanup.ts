import { test as base } from "@playwright/test";

import {
  trackBrowserErrors,
  type IBrowserErrorTracker
} from "../helpers/browserErrors";
import { cleanupUserData, getE2ePrisma } from "../helpers/db";
import { getWorkerUser } from "./auth";

export interface IResourceTracker {
  /** Email of the user owning the tracked resources. Defaults to the worker user. */
  ownerEmail: string;
  trackGameshow: (id: string) => void;
  trackRoom: (id: string) => void;
  readonly gameshowIds: readonly string[];
  readonly roomIds: readonly string[];
}

type CleanupFixtures = {
  tracker: IResourceTracker;
  browserErrors: IBrowserErrorTracker;
};

export const test = base.extend<CleanupFixtures>({
  tracker: [
    async ({}, use, testInfo) => {
      const gameshowIds = new Set<string>();
      const roomIds = new Set<string>();
      const tracker: IResourceTracker = {
        ownerEmail: getWorkerUser(testInfo.parallelIndex).email,
        trackGameshow: (id) => void gameshowIds.add(id),
        trackRoom: (id) => void roomIds.add(id),
        get gameshowIds() {
          return [...gameshowIds];
        },
        get roomIds() {
          return [...roomIds];
        }
      };

      await use(tracker);

      if (gameshowIds.size === 0 && roomIds.size === 0) return;

      const prisma = getE2ePrisma();
      const owner = await prisma.user.findUnique({
        where: { email: tracker.ownerEmail },
        select: { id: true }
      });
      if (!owner) {
        throw new Error(
          `Cleanup fehlgeschlagen: user ${tracker.ownerEmail} nicht gefunden (gameshows: ${[...gameshowIds].join(", ")}; rooms: ${[...roomIds].join(", ")})`
        );
      }
      await cleanupUserData(owner.id, {
        gameshowIds: [...gameshowIds],
        roomIds: [...roomIds]
      });
    },
    { auto: true }
  ],

  browserErrors: async ({ page }, use) => {
    await use(trackBrowserErrors(page));
  }
});
