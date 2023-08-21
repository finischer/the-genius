import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const safedUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().nullable(),
  email: z.string(),
  role: z.nativeEnum(UserRole),
});

export type SafedUser = z.infer<typeof safedUserSchema>;

export const usersRouter = createTRPCRouter({
  create: publicProcedure
    .output(safedUserSchema)
    .input(
      z.object({
        name: z
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

      const isUsernameAlreadyRegisterd = await ctx.prisma.user.findFirst({
        where: {
          name: input.name,
        },
      });

      if (isUsernameAlreadyRegisterd)
        throw new TRPCError({
          code: "CONFLICT",
          message: `Der Username ${input.name} existiert bereits`,
        });

      const user = await ctx.prisma.user.create({
        data: {
          ...input,
          password: await bcrypt.hash(input.password, 10),
        },
        include: {
          gameshows: true,
        },
      });

      return user;
    }),

  getAll: protectedProcedure.query(() => {
    return "all users can see this message";
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
