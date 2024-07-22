import { PrismaClient } from "@prisma/client";

import { isDevelopment, isProduction } from "~/utils/environment";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isDevelopment ? ["query", "error", "warn"] : ["error"]
  });

if (!isProduction) globalForPrisma.prisma = prisma;
