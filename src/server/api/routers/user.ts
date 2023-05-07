import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import bcrypt from "bcrypt";
import { filterUserForClient } from "~/server/helpers/filterForUserClient";

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
      const isEmailAlreadyRegisterd = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (isEmailAlreadyRegisterd)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Die E-Mail Adresse existiert bereits",
        });

      const isUsernameAlreadyRegisterd = await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        },
      });

      if (isUsernameAlreadyRegisterd)
        throw new TRPCError({
          code: "CONFLICT",
          message: `Der Username ${input.username} existiert bereits`,
        });

      const user = await ctx.prisma.user.create({
        data: {
          ...input,
          password: await bcrypt.hash(input.password, 10),
        },
      });

      return filterUserForClient(user);
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return "all users can see this message";
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
