import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  TGameSettingsMap,
  TGameshowConfig,
} from "~/hooks/useConfigurator/useConfigurator.types";
import { TGameNames } from "~/games/game.types";

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
          games: config.games, // TODO: fix game schema in prisma
          creatorId: ctx.session.user.id,
        },
      });

      return gameshow;
    }),
});
