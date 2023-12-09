export interface IFeedbackFormProps {
  opened: boolean;
  closeForm: () => void;
}

export interface IFeedbackFormValues {
  ratingGeneralExperience: number;
  ratingControlModerator: number;
  ratingDesign: number;
  comment: string;
}
