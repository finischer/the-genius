import { z } from "zod";
import { MAX_TEXTAREA_LENGTH } from "~/config/forms";

import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";

export const safedFeebackSchema = z.object({
  id: z.string(),
  comment: z.string(),
  ratingGeneralExperience: z.number(),
  ratingControlModerator: z.number(),
  ratingDesign: z.number(),
  creator: z.object({
    username: z.string().nullish(),
    email: z.string(),
  }),
  createdAt: z.date(),
});

export type SafedFeedback = z.infer<typeof safedFeebackSchema>;

export const feedbacksRouter = createTRPCRouter({
  create: adminProcedure
    .output(safedFeebackSchema)
    .input(
      z.object({
        comment: z
          .string()
          .min(1, "Dein Feedback muss mindestens 1 Zeichen lang sein")
          .max(MAX_TEXTAREA_LENGTH, `Dein Feedback darf maximal ${MAX_TEXTAREA_LENGTH} Zeichen lang sein`),
        ratingGeneralExperience: z
          .number()
          .min(1, "Das Rating muss mindestens 1 sein")
          .max(5, "Das Rating darf maximal 5 sein"),
        ratingControlModerator: z
          .number()
          .min(1, "Das Rating muss mindestens 1 sein")
          .max(5, "Das Rating darf maximal 5 sein"),
        ratingDesign: z
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
  getAll: adminProcedure.output(z.array(safedFeebackSchema)).query(async ({ ctx, input }) => {
    const allFeedbacks = await ctx.prisma.feedback.findMany({
      include: {
        creator: true,
      },
    });

    return allFeedbacks;
  }),
});
