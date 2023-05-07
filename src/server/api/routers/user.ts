import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        username: z
          .string()
          .trim()
          .min(3, "Dein Username muss mindestens 3 Zeichen enthalten")
          .max(20, "Dein Username darf maximal 20 Zeichen enthalten"),
        email: z
          .string()
          .trim()
          .min(1, "Du musst eine Email eingeben")
          .email("Invalide email"),
        password: z
          .string()
          .min(6, "Dein Passwort muss mindestens 6 Zeichen enthalten"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.create({
        data: {
          ...input,
        },
      });

      return user;
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return "all users can see this message";
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
