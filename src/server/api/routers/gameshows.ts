import { createTRPCRouter, protectedProcedure } from "../trpc";

export const gameshowsRouter = createTRPCRouter({
  getAllByCreatorId: protectedProcedure.query(async ({ ctx }) => {
    const gameshows = await ctx.prisma.gameshow.findMany({
      where: {
        creatorId: ctx.session.user.id,
      },
    });

    return gameshows;
  }),
});
