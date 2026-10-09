import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../.generated/prisma/client";
import { selectCleanupTargets } from "../support/cleanup";
import { assertSafeDatabaseUrl } from "../support/database";

export interface ICleanupIds {
  gameshowIds?: readonly string[];
  roomIds?: readonly string[];
}

let client: PrismaClient | undefined;

export function getE2ePrisma(): PrismaClient {
  if (client) return client;
  const url = process.env.DATABASE_URL;
  assertSafeDatabaseUrl(url);
  client = new PrismaClient({
    adapter: new PrismaPg({ connectionString: url }),
    log: ["error"]
  });
  return client;
}

export async function disconnectE2ePrisma(): Promise<void> {
  if (!client) return;
  await client.$disconnect();
  client = undefined;
}

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Deletes only the tracked rooms and gameshows owned by the given user.
 * Throws with resource type and ID for every failed deletion.
 */
export async function cleanupUserData(
  userId: string,
  { gameshowIds = [], roomIds = [] }: ICleanupIds = {}
): Promise<void> {
  const prisma = getE2ePrisma();
  const failures: string[] = [];

  for (const roomId of roomIds) {
    try {
      await prisma.room.deleteMany({
        where: { id: roomId, creatorId: userId }
      });
    } catch (error) {
      failures.push(
        `Cleanup fehlgeschlagen: room ${roomId} (${describeError(error)})`
      );
    }
  }

  let targetIds: string[] = [];
  try {
    const candidates = await prisma.gameshow.findMany({
      where: { id: { in: [...gameshowIds] } },
      select: { id: true, creatorId: true }
    });
    targetIds = selectCleanupTargets(userId, candidates);
  } catch (error) {
    for (const id of gameshowIds) {
      failures.push(
        `Cleanup fehlgeschlagen: gameshow ${id} (${describeError(error)})`
      );
    }
  }

  for (const gameshowId of targetIds) {
    try {
      await prisma.gameshow.delete({ where: { id: gameshowId } });
    } catch (error) {
      failures.push(
        `Cleanup fehlgeschlagen: gameshow ${gameshowId} (${describeError(error)})`
      );
    }
  }

  if (failures.length > 0) {
    throw new Error(failures.join("\n"));
  }
}
