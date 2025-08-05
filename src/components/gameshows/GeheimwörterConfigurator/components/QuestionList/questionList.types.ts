import type { Dispatch, SetStateAction } from "react";
import { type TGeheimwoerterQuestionItem } from "../../../../games/Geheimwörter/geheimwörter.types";
import type { Updater } from "use-immer";

export interface IQuestionListProps {
  questions: TGeheimwoerterQuestionItem[];
  questionItem: TGeheimwoerterQuestionItem;
  setQuestionItem: Updater<TGeheimwoerterQuestionItem>;
  setQuestions: Dispatch<SetStateAction<TGeheimwoerterQuestionItem[]>>;
}
