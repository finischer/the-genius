import { GameshowMode } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { GAMESHOW_MODES } from "~/styles/constants";

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

    create: protectedProcedure
      .input(
        z.object({
          roomName: z.string().min(3).max(100),
          modus: z.nativeEnum(GameshowMode),
          isPrivateRoom: z.boolean().default(true),
          password: z.string().min(3).max(20),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const room = await ctx.prisma.room.create({
          data: {
            name: input.roomName,
            modus: input.modus,
            password: input.password,
            isPrivate: input.isPrivateRoom,
            creatorId: ctx.session.user.id,
          },
        });

        return room;
      });

    return exclude(rooms, ["password"]);
  }),
});
