import { GameshowMode } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";

// Exclude keys from user
function exclude<Room, Key extends keyof Room>(
  rooms: Room[],
  keys: Key[]
): Omit<Room[], Key> {
  const newRooms = rooms.map((room) => {
    for (const key of keys) {
      delete room[key];
    }

    return room;
  });

  return newRooms;
}

export const roomsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const rooms = await ctx.prisma.room.findMany({
      include: {
        creator: {
          select: {
            username: true,
          },
        },
      },
    });
    return exclude(rooms, ["password"]);
  }),

  create: protectedProcedure
    .input(
      z.object({
        roomName: z
          .string()
          .trim()
          .min(3, "Der Raumname muss mindestens 3 Zeichen enthalten")
          .max(50, "Der Raumname darf maximal 50 Zeichen enthalten"),
        modus: z.nativeEnum(GameshowMode),
        isPrivateRoom: z.boolean().default(true),
        password: z
          .string()
          .min(3, "Das Passwort muss mindestens 3 Zeichen enthalten")
          .max(20, "Das Passwort darf maximal 20 Zeichen enthalten"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const room = await ctx.prisma.room.create({
        data: {
          name: input.roomName,
          modus: input.modus,
          password: await bcrypt.hash(input.password, 10),
          isPrivate: input.isPrivateRoom,
          creatorId: ctx.session.user.id,
        },
      });

      return room;
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

      return isValidPassword;
    }),
});
