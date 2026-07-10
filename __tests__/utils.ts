import { type Session } from "next-auth";
import { createInnerTRPCContext, t } from "~/server/api/trpc";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import type { vi } from "vitest";
import type { Gameshow } from "@prisma/client";

export function getTestCaller(session: Session | null) {
  const ctx = createInnerTRPCContext({ session });
  const createCaller = t.createCallerFactory(appRouter);
  return createCaller(ctx);
}

export function mockFindManyGameshows(shows: Gameshow[]) {
  (prisma.gameshow.findMany as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
    shows
  );
}