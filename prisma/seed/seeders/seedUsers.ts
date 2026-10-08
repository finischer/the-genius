import type { PrismaClient } from "~/generated/prisma/client";
import { SEED_USERS } from "../data/users";

export async function seedUsers(prisma: PrismaClient): Promise<void> {
  for (const user of SEED_USERS) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user
    });
  }
  console.log(`✓ Users seeded (${SEED_USERS.length})`);
}
