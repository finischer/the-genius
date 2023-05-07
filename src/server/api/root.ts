import { createTRPCRouter } from "~/server/api/trpc";
import { usersRouter } from "~/server/api/routers/users";
import { roomsRouter } from "./routers/rooms";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: usersRouter,
  rooms: roomsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
