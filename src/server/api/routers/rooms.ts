import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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
});
