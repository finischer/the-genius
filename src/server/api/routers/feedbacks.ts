import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const safedFeebackSchema = z.object({
  id: z.string(),
  comment: z.string(),
  ratingGeneralExperience: z.number(),
  ratingControlModerator: z.number(),
  creator: z.object({
    username: z.string().nullish(),
    email: z.string(),
  }),
});

export type SafedFeedback = z.infer<typeof safedFeebackSchema>;

export const feedbacksRouter = createTRPCRouter({
  create: protectedProcedure
    .output(safedFeebackSchema)
    .input(
      z.object({
        comment: z
          .string()
          .min(1, "Dein Feedback muss mindestens 1 Zeichen lang sein")
          .max(1000, "Dein Feedback darf maximal 1000 Zeichen lang sein"),
        ratingGeneralExperience: z
          .number()
          .min(1, "Das Rating muss mindestens 1 sein")
          .max(5, "Das Rating darf maximal 5 sein"),
        ratingControlModerator: z
          .number()
          .min(1, "Das Rating muss mindestens 1 sein")
          .max(5, "Das Rating darf maximal 5 sein"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const feedback = await ctx.prisma.feedback.create({
        data: {
          ...input,
          creatorId: ctx.session.user.id,
        },
        include: {
          creator: true,
        },
      });

      return feedback;
    }),
  getAll: protectedProcedure.output(z.array(safedFeebackSchema)).query(async ({ ctx, input }) => {
    const allFeedbacks = await ctx.prisma.feedback.findMany({
      include: {
        creator: true,
      },
    });

    return allFeedbacks;
  }),
});
