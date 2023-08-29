import { GameshowMode } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const safedRoomSchema = z.object({
  id: z.string(),
  name: z.string(),
  isPrivate: z.boolean(),
  modus: z.nativeEnum(GameshowMode),
  participants: z.array(z.string()),
  creator: z.object({
    username: z.string().nullish(),
  }),
  isCreator: z.boolean(),
  roomSize: z.number(),
  createdAt: z.date(),
});

export type SafedRoom = z.infer<typeof safedRoomSchema>;

export const roomsRouter = createTRPCRouter({
  getAll: protectedProcedure
    .output(z.array(safedRoomSchema))
    .query(async ({ ctx }) => {
      const rooms = await ctx.prisma.room.findMany({
        include: {
          creator: {
            select: {
              username: true,
            },
          },
        },
      });

      // check if user is the room creator
      const roomsWithIsCreatorField = rooms.map((room) => ({
        ...room,
        isCreator: room.creatorId === ctx.session.user.id,
      }));

      return roomsWithIsCreatorField;
    }),
  validatePassword: protectedProcedure
    .input(
      z.object({
        roomId: z.string(),
        password: z
          .string()
          .min(3, "Das Passwort muss mindestens 3 Zeichen enthalten")
          .max(20, "Das Passwort darf maximal 20 Zeichen enthalten"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const room = await ctx.prisma.room.findUnique({
        select: {
          id: true,
          password: true,
        },
        where: {
          id: input.roomId,
        },
      });

      if (!room) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Der Raum existiert nicht",
        });
      }

      if (!room.password) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Dieser Raum ist nicht passwortgeschützt",
        });
      }

      const isValidPassword = await bcrypt.compare(
        input.password,
        room.password
      );

      const res = {
        roomId: room.id,
        isValidPassword,
      };

      return res;
    }),
});
