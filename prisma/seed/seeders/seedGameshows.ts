import type { PrismaClient } from "~/generated/prisma/client";
import { SEED_GAMESHOWS } from "../data/gameshows";
import { seededDate, seededUpdatedAt } from "../utils/dates";

export async function seedGameshows(prisma: PrismaClient): Promise<void> {
  let created = 0;
  let skipped = 0;

  for (const gameshow of SEED_GAMESHOWS) {
    const user = await prisma.user.findUnique({
      where: { email: gameshow.creatorEmail }
    });

    if (!user) {
      console.warn(`  ⚠ Skipping "${gameshow.name}": user ${gameshow.creatorEmail} not found`);
      skipped++;
      continue;
    }

    const exists = await prisma.gameshow.findFirst({
      where: { name: gameshow.name, creatorId: user.id }
    });

    if (exists) {
      skipped++;
      continue;
    }

    const { creatorEmail: _, ...data } = gameshow;
    const seedKey = `${gameshow.creatorEmail}:${gameshow.name}`;

    await prisma.gameshow.create({
      data: {
        ...data,
        creatorId: user.id,
        createdAt: seededDate(seedKey),
        updatedAt: seededUpdatedAt(seedKey)
      }
    });
    created++;
  }

  console.log(`✓ Gameshows seeded (${created} created, ${skipped} skipped)`);
}
