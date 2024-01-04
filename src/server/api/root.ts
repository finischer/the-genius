import { createTRPCRouter } from "~/server/api/trpc";
import { usersRouter } from "~/server/api/routers/users";
import { roomsRouter } from "./routers/rooms";
import { gameshowsRouter } from "./routers/gameshows";
import { feedbacksRouter } from "./routers/feedbacks";
import { betaTestersRouter } from "./routers/betaTesters";
import { gamesRouter } from "./routers/games";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: usersRouter,
  rooms: roomsRouter,
  gameshows: gameshowsRouter,
  feedbacks: feedbacksRouter,
  betaTesters: betaTestersRouter,
  games: gamesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
