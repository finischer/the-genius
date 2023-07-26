import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { type TGameshowConfig } from "~/hooks/useConfigurator/useConfigurator.types";

export const gameshowsRouter = createTRPCRouter({
  getAllByCreatorId: protectedProcedure.query(async ({ ctx }) => {
    const gameshows = await ctx.prisma.gameshow.findMany({
      where: {
        creatorId: ctx.session.user.id,
      },
    });

    return gameshows;
  }),
  create: protectedProcedure
    .input(z.unknown())
    .mutation(async ({ ctx, input }) => {
      const config = input as TGameshowConfig;
      const gameshow = await ctx.prisma.gameshow.create({
        data: {
          name: config.name,
          // workaround until prisma type is set correctly
          // @ts-expect-error
          games: config.games, // TODO: fix game schema in prisma
          creatorId: ctx.session.user.id,
        },
      });
      return gameshow;
    }),
});
