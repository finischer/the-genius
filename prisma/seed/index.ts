import { prisma } from "~/server/db";
import { seedFeedbacks } from "./seeders/seedFeedbacks";
import { seedGameshows } from "./seeders/seedGameshows";
import { seedUsers } from "./seeders/seedUsers";

// Tables excluded from clearing:
// - _prisma_migrations: migration history must be preserved
// - games: managed by migrations, not seed data
// - sessions / accounts / verificationTokens: NextAuth auth infrastructure –
//   clearing these would invalidate active browser sessions
// - users: kept to preserve active sessions (seedUsers uses upsert)
const SKIP_TABLES = new Set([
  "_prisma_migrations",
  "games",
  "sessions",
  "accounts",
  "verificationTokens",
  "users"
]);

async function clearDatabase(): Promise<void> {
  const tables = await prisma.$queryRaw<{ tablename: string }[]>`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  `;

  const toClear = tables.filter((t) => !SKIP_TABLES.has(t.tablename));

  if (toClear.length === 0) {
    console.log("🗑 No tables to clear.\n");
    return;
  }

  const tableNames = toClear.map((t) => `"${t.tablename}"`).join(", ");
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE`
  );
  console.log(`🗑 Cleared ${toClear.length} tables.\n`);
}

/**
 * Clears the DB (except auth + migration tables) and re-seeds all data.
 * Only runs when ENABLE_SEED=true and APP_ENV != "production".
 *
 * Order:
 *  1. Users      – upsert by email (preserves sessions)
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

  if (process.env.APP_ENV === "production") {
    console.log("⛔ Seed blocked (APP_ENV is production).");
    return;
  }

  console.log("🌱 Starting seed...\n");

  await clearDatabase();
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
