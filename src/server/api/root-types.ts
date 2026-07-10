/**
 * Type-only exports for the tRPC router.
 * This file should only contain type exports and no runtime code.
 * This prevents server-only code from being bundled in the client.
 */
import type { appRouter } from "./root";

export type AppRouter = typeof appRouter;
