import { prisma } from "~/server/db";
import { seedFeedbacks } from "./seeders/seedFeedbacks";
import { seedGameshows } from "./seeders/seedGameshows";
import { seedUsers } from "./seeders/seedUsers";

/**
 * Runs all seeders in dependency order. Every seeder is idempotent.
 * Only runs when ENABLE_SEED=true is set — never on production.
 *
 * Order:
 *  1. Users      – no dependencies
 *  2. Gameshows  – depends on Users
 *  3. Feedbacks  – depends on Users
 *
 * Adding a new seeder:
 *  1. Create data file in  prisma/seed/data/
 *  2. Create seeder in     prisma/seed/seeders/
 *  3. Import and call it here in the correct order
 */
async function main(): Promise<void> {
  if (process.env.ENABLE_SEED !== "true") {
    console.log("⏭ Seed skipped (ENABLE_SEED is not set to 'true').");
    return;
  }

  if (process.env.NEXT_PUBLIC_THE_GENIUS_ENV === "production") {
    console.log("⛔ Seed blocked (environment is production).");
    return;
  }

  console.log("🌱 Starting seed...\n");

  await seedUsers(prisma);
  await seedGameshows(prisma);
  await seedFeedbacks(prisma);

  console.log("\n✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
