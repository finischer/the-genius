import { GameshowDifficulty, GameshowVisbility } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { ObjectId } from "bson";
import { z } from "zod";
import { type TGameshowConfig } from "~/hooks/useGameshowConfig/useGameshowConfig.types";
import {
  createGameshowProcedure,
  createTRPCRouter,
  protectedProcedure
} from "../trpc";

export const safedGameshowSchema = z.object({
  id: z.string(),
  creatorId: z.string(),
  name: z.string(),
  numOfGames: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isFavorite: z.boolean(),
  games: z.array(z.any()),
  visibility: z.nativeEnum(GameshowVisbility),
  difficulty: z.nativeEnum(GameshowDifficulty).nullable(),
  originalCreatorId: z.string().nullable(),
  originalGameshowId: z.string().nullable(),
  importedGameshow: z.boolean().nullable(),
  isModified: z.boolean().nullable()
});

export const safedPublicGameshowSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  difficulty: z.nativeEnum(GameshowDifficulty),
  games: z.array(z.any()),
  user: z.object({
    username: z.string(),
    id: z.string()
  }),
  originalCreatorId: z.string().nullable(),
  originalGameshowId: z.string().nullable(),
  importedGameshow: z.boolean().nullable()
});

export type SafedGameshow = z.infer<typeof safedGameshowSchema>;
export type SafedPublicGameshow = z.infer<typeof safedPublicGameshowSchema>;

export const gameshowsRouter = createTRPCRouter({
  getAllByCreatorId: protectedProcedure
    .output(z.array(safedGameshowSchema))
    .query(async ({ ctx }) => {
      const gameshows = await ctx.prisma.gameshow.findMany({
        where: {
          creatorId: ctx.session.user.id
        },
        select: {
          id: true,
          creatorId: true,
          name: true,
          games: true,
          createdAt: true,
          updatedAt: true,
          isFavorite: true,
          visibility: true,
          originalCreatorId: true,
          originalGameshowId: true,
          difficulty: true,
          importedGameshow: true,
          isModified: true
        }
      });

      // add num of games to every gameshow
      const modifiedGameshows = gameshows.map((show) => ({
        ...show,
        numOfGames: show.games.length
      }));

      return modifiedGameshows;
    }),
  getById: protectedProcedure
    .input(z.object({ gameshowId: z.string() }))
    .output(safedGameshowSchema)
    .query(async ({ input, ctx }) => {
      const gameshow = await ctx.prisma.gameshow.findFirst({
        where: {
          id: input.gameshowId,
          creatorId: ctx.session.user.id
        }
      });

      if (!gameshow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Gameshow not found"
        });
      }

      // add num of games to every gameshow
      const modifiedGameshow: z.infer<typeof safedGameshowSchema> = {
        ...gameshow,
        numOfGames: gameshow.games.length
      };

      return modifiedGameshow;
    }),
  getPublicGameshows: protectedProcedure
    .output(z.array(safedPublicGameshowSchema))
    .query(async ({ ctx }) => {
      const gameshows = await ctx.prisma.gameshow.findMany({
        where: {
          visibility: GameshowVisbility.PUBLIC,
          user: {
            isNot: null
          }
        },
        select: {
          id: true,
          name: true,
          description: true,
          games: true,
          difficulty: true,
          originalCreatorId: true,
          originalGameshowId: true,
          importedGameshow: true,
          user: {
            select: {
              username: true,
              id: true
            }
          }
        }
      });

      const returnedGameshows = gameshows.map((gameshow) => ({
        ...gameshow,
        difficulty: gameshow.difficulty ?? GameshowDifficulty.MEDIUM,
        description: gameshow.description ?? "",
        user: {
          ...gameshow.user,
          username: gameshow.user.username ?? "UNKNOWN_USER"
        }
      }));

      return returnedGameshows;
    }),
  create: createGameshowProcedure
    .input(z.unknown())
    .mutation(async ({ ctx, input }) => {
      const config = input as TGameshowConfig;
      const gameshow = await ctx.prisma.gameshow.create({
        data: {
          name: config.name,
          // workaround until prisma type is set correctly
          // @ts-expect-error
          games: config.games, // TODO: fix game schema in prisma
          creatorId: ctx.session.user.id
        }
      });

      return gameshow;
    }),
  update: protectedProcedure
    .input(
      z.object({
        gameshowId: z.string(),
        updatedGameshow: z.unknown()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const gameshow = await ctx.prisma.gameshow.findFirst({
        where: {
          id: input.gameshowId,
          creatorId: ctx.session.user.id
        }
      });

      if (!gameshow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Gameshow konnte nicht gespeichert werden"
        });
      }

      const config = input.updatedGameshow as TGameshowConfig;

      const updatedGameshow = await ctx.prisma.gameshow.update({
        data: {
          name: config.name,
          // workaround until prisma type is set correctly
          // @ts-expect-error
          games: config.games, // TODO: fix game schema in prisma
          // Mark imported gameshow as modified when updated
          ...(gameshow.importedGameshow && { isModified: true })
        },
        where: {
          id: input.gameshowId
        }
      });

      return updatedGameshow;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        gameshowId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const gameshowToDelete = await ctx.prisma.gameshow.findFirst({
        where: {
          creatorId: ctx.session.user.id,
          id: input.gameshowId
        }
      });

      if (!gameshowToDelete) {
        throw new TRPCError({
          code: "FORBIDDEN"
        });
      }

      const gameshow = await ctx.prisma.gameshow.delete({
        where: {
          id: input.gameshowId
        }
      });

      return gameshow;
    }),
  publishGameshow: protectedProcedure
    .input(
      z.object({
        gameshowId: z.string(),
        name: z.string(),
        description: z.string(),
        difficultyLevel: z.nativeEnum(GameshowDifficulty)
      })
    )
    .mutation(async ({ ctx, input }) => {
      const gameshow = await ctx.prisma.gameshow.findFirst({
        where: {
          id: input.gameshowId,
          creatorId: ctx.session.user.id
        }
      });

      if (!gameshow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Gameshow konnte nicht gespeichert werden"
        });
      }

      // Prevent publishing unmodified imported gameshows
      if (gameshow.importedGameshow && !gameshow.isModified) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Unveränderte importierte Spielshows können nicht veröffentlicht werden. Bitte bearbeiten Sie die Spielshow zuerst."
        });
      }

      const updatedGameshow = await ctx.prisma.gameshow.update({
        data: {
          visibility: GameshowVisbility.PUBLIC,
          description: input.description,
          name: input.name,
          difficulty: input.difficultyLevel
        },
        where: {
          id: input.gameshowId
        }
      });

      return updatedGameshow;
    }),
  importGameshow: createGameshowProcedure
    .input(
      z.object({
        gameshowId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const gameshow = await ctx.prisma.gameshow.findFirst({
        where: {
          id: input.gameshowId
        }
      });

      if (!gameshow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Gameshow konnte nicht gefunden werden"
        });
      }

      if (gameshow.importedGameshow) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can't import an imported gameshow."
        });
      }

      if (gameshow.visibility === GameshowVisbility.PRIVATE) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can't import a private gameshow."
        });
      }

      return await ctx.prisma.gameshow.create({
        data: {
          id: new ObjectId().toString(),
          description: gameshow.description,
          difficulty: gameshow.difficulty,
          name: gameshow.name,
          games: JSON.parse(
            JSON.stringify(gameshow.games)
          ) as typeof gameshow.games, // Deep copy to prevent reference sharing
          creatorId: ctx.session.user.id,
          importedGameshow: true,
          isModified: false,
          originalCreatorId: gameshow.creatorId,
          originalGameshowId: gameshow.id
        }
      });
    })
});
