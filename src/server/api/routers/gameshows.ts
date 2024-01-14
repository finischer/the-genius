import { z } from "zod";
import { type TGameshowConfig } from "~/hooks/useConfigurator/useConfigurator.types";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { FEATURES } from "~/config/features";
import { TRPCError } from "@trpc/server";

export const safedGameshowSchema = z.object({
  id: z.string(),
  creatorId: z.string(),
  name: z.string(),
  numOfGames: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isFavorite: z.boolean(),
  games: z.array(z.any()),
});

export type SafedGameshow = z.infer<typeof safedGameshowSchema>;

export const gameshowsRouter = createTRPCRouter({
  getAllByCreatorId: protectedProcedure.output(z.array(safedGameshowSchema)).query(async ({ ctx }) => {
    const gameshows = await ctx.prisma.gameshow.findMany({
      where: {
        creatorId: ctx.session.user.id,
      },
      select: {
        id: true,
        creatorId: true,
        name: true,
        games: true,
        createdAt: true,
        updatedAt: true,
        isFavorite: true,
      },
    });

    // add num of games to every gameshow
    const modifiedGameshows = gameshows.map((show) => ({
      ...show,
      numOfGames: show.games.length,
    }));

    return modifiedGameshows;
  }),
  create: protectedProcedure.input(z.unknown()).mutation(async ({ ctx, input }) => {
    const role = ctx.session.user.role;
    const maxNumGameshows = FEATURES[role].maxNumGameshows;

    if (maxNumGameshows !== Infinity) {
      const numOfGameshows = await ctx.prisma.gameshow.count({
        where: {
          creatorId: ctx.session.user.id,
        },
      });

      if (numOfGameshows >= maxNumGameshows) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Du hast die maximale Anzahl an Spielshows erreichst",
        });
      }
    }

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
