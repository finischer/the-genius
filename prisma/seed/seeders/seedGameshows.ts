import type { PrismaClient } from "~/generated/prisma/client";
import { SEED_GAMESHOWS } from "../data/gameshows";

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

    await prisma.gameshow.create({
      data: { ...data, creatorId: user.id }
    });
    created++;
  }

  console.log(`✓ Gameshows seeded (${created} created, ${skipped} skipped)`);
}
