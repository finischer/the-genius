import type { PrismaClient } from "~/generated/prisma/client";
import { SEED_FEEDBACKS } from "../data/feedbacks";
import { seededDate, seededUpdatedAt } from "../utils/dates";

export async function seedFeedbacks(prisma: PrismaClient): Promise<void> {
  let created = 0;
  let skipped = 0;

  for (const feedback of SEED_FEEDBACKS) {
    const user = await prisma.user.findUnique({
      where: { email: feedback.creatorEmail }
    });

    if (!user) {
      console.warn(
        `  ⚠ Skipping feedback: user ${feedback.creatorEmail} not found`
      );
      skipped++;
      continue;
    }

    const exists = await prisma.feedback.findFirst({
      where: { creatorId: user.id }
    });

    if (exists) {
      skipped++;
      continue;
    }

    const { creatorEmail: _, ...data } = feedback;
    const seedKey = `feedback:${feedback.creatorEmail}`;

    await prisma.feedback.create({
      data: {
        ...data,
        creatorId: user.id,
        createdAt: seededDate(seedKey),
        updatedAt: seededUpdatedAt(seedKey)
      }
    });
    created++;
  }

  console.log(`✓ Feedbacks seeded (${created} created, ${skipped} skipped)`);
}
