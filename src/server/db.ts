import { PrismaClient } from "@prisma/client";

import { isDevelopmentServer, isProduction } from "~/utils/environment";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isDevelopmentServer ? ["query", "error", "warn"] : ["error"]
  });

if (!isProduction) globalForPrisma.prisma = prisma;
