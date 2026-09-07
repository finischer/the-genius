import type { PrismaClient } from "~/generated/prisma/client";
import { SEED_FEEDBACKS } from "../data/feedbacks";

export async function seedFeedbacks(prisma: PrismaClient): Promise<void> {
  let created = 0;
  let skipped = 0;

  for (const feedback of SEED_FEEDBACKS) {
    const user = await prisma.user.findUnique({
      where: { email: feedback.creatorEmail }
    });

    if (!user) {
      console.warn(`  ⚠ Skipping feedback: user ${feedback.creatorEmail} not found`);
      skipped++;
      continue;
    }

    // Feedbacks sind nicht unique – nur einmal pro User anlegen
    const exists = await prisma.feedback.findFirst({
      where: { creatorId: user.id }
    });

    if (exists) {
      skipped++;
      continue;
    }

    const { creatorEmail: _, ...data } = feedback;

    await prisma.feedback.create({
      data: { ...data, creatorId: user.id }
    });
    created++;
  }

  console.log(`✓ Feedbacks seeded (${created} created, ${skipped} skipped)`);
}
