import { createTRPCRouter, protectedProcedure } from "../trpc";

export const gamesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const games = await ctx.prisma.game.findMany();
    return games;
  }),
});
