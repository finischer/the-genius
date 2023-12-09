import type { SafedFeedback } from "~/server/api/routers/feedbacks";

export interface IFeedbackListProps {
  feedbacks: SafedFeedback[];
}
