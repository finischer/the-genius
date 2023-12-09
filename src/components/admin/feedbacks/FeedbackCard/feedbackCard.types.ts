import type { Feedback } from "@prisma/client";
import type { SafedFeedback } from "~/server/api/routers/feedbacks";

export interface IFeedbackCardProps {
  feedback: SafedFeedback;
}
