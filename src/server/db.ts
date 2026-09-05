import { PrismaPg } from "@prisma/adapter-pg";

import { isDevelopmentServer, isProduction } from "~/utils/environment";
import { env } from "~/env.mjs";
import { PrismaClient } from "~/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: isDevelopmentServer ? ["query", "error", "warn"] : ["error"]
  });

if (!isProduction) globalForPrisma.prisma = prisma;
