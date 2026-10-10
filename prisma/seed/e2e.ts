import { config as loadDotenv } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "~/generated/prisma/client";
import type { UserRole } from "~/generated/prisma/enums";
import { Game } from "~/games/core/types";
import { assertSafeDatabaseUrl } from "../../e2e/support/database";
import { findMissingEnv } from "../../e2e/support/env";
import { releasedGames } from "../../e2e/support/gameCases";

const WORKER_COUNT = 4;
const WORKER_EMAIL_DOMAIN = "thegenius.e2e";
const REQUIRED_SEED_ENV = [
  "E2E_TEST_EMAIL",
  "E2E_TEST_PASSWORD",
  "E2E_ADMIN_EMAIL",
  "E2E_ADMIN_PASSWORD"
] as const;

interface IE2eSeedUser {
  email: string;
  password: string;
  role: UserRole;
  username: string;
}

function buildSeedUsers(env: NodeJS.ProcessEnv): IE2eSeedUser[] {
  const testPassword = env.E2E_TEST_PASSWORD ?? "";
  const workers = Array.from({ length: WORKER_COUNT }, (_, index) => ({
    email: `e2e-worker-${index}@${WORKER_EMAIL_DOMAIN}`,
    password: testPassword,
    role: "PREMIUM" as const,
    username: `e2e-worker-${index}`
  }));

  return [
    {
      email: env.E2E_TEST_EMAIL ?? "",
      password: testPassword,
      role: "USER",
      username: "e2e-user"
    },
    {
      email: env.E2E_ADMIN_EMAIL ?? "",
      password: env.E2E_ADMIN_PASSWORD ?? "",
      role: "ADMIN",
      username: "e2e-admin"
    },
    ...workers
  ];
}

async function seedUsers(prisma: PrismaClient): Promise<void> {
  for (const user of buildSeedUsers(process.env)) {
    const data = {
      name: user.username,
      username: user.username,
      role: user.role,
      password: user.password,
      isEmailVerified: true,
      isFirstVisit: false
    };
    await prisma.user.upsert({
      where: { email: user.email },
      update: data,
      create: { email: user.email, ...data }
    });
  }
  console.log(`✓ E2E users seeded (${WORKER_COUNT + 2})`);
}

async function verifyGames(prisma: PrismaClient): Promise<void> {
  const problems: string[] = [];

  const games = releasedGames(Object.values(Game));
  for (const game of games) {
    const records = await prisma.game.findMany({ where: { slug: game } });
    if (records.length !== 1 || !records[0]?.active) {
      const reason =
        records.length === 0
          ? "kein Datensatz in der Tabelle games"
          : "Datensatz ist inaktiv (active: false)";
      problems.push(
        `Spiel "${game}": ${reason}. Es fehlt vermutlich eine Prisma-Migration, die das Spiel mit slug "${game}" und active: true einträgt.`
      );
    }
  }

  if (problems.length > 0) throw new Error(problems.join("\n"));
  console.log(`✓ Games verified (${games.length})`);
}

async function main(): Promise<void> {
  loadDotenv({ path: ".env.test", override: true, quiet: true });

  assertSafeDatabaseUrl(process.env.DATABASE_URL);
  const missing = findMissingEnv(REQUIRED_SEED_ENV, process.env);
  if (missing.length > 0) {
    throw new Error(
      `Fehlende Umgebungsvariablen für den E2E-Seed: ${missing.join(", ")}`
    );
  }

  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL ?? ""
  });
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("🌱 Starting E2E seed...\n");
    await seedUsers(prisma);
    await verifyGames(prisma);
    console.log("\n✅ E2E seed complete.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(
    "❌ E2E seed failed:",
    error instanceof Error ? error.message : error
  );
  process.exit(1);
});
