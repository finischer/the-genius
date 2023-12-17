import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "../trpc";

const zodEmailString = z.string().email("Keine gültige Email");

export const betaTestersRouter = createTRPCRouter({
  create: adminProcedure.input(zodEmailString).mutation(async ({ ctx, input }) => {
    const betaTester = await ctx.prisma.betaTester.create({
      data: {
        email: input,
      },
    });

    return betaTester;
  }),
  getAll: adminProcedure.query(async ({ ctx }) => {
    const testerList = await ctx.prisma.betaTester.findMany();
    return testerList;
  }),
  deleteById: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const testerList = await ctx.prisma.betaTester.delete({
      where: {
        id: input,
      },
    });
    return testerList;
  }),
  updateEmail: adminProcedure
    .input(
      z.object({
        id: z.string(),
        email: zodEmailString,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const testerList = await ctx.prisma.betaTester.update({
        where: {
          id: input.id,
        },
        data: {
          email: input.email,
        },
      });
      return testerList;
    }),
});
