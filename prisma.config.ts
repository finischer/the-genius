import "dotenv/config";
import path from "node:path";
import type { PrismaConfig } from "~/generated/prisma/client";

export default {
  schema: path.join("prisma"),
  migrations: {
    path: path.join("prisma", "migrations")
  },
  datasource: {
    url: process.env.DATABASE_URL ?? ""
  }
} satisfies PrismaConfig;
