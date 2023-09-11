import type { Dispatch, SetStateAction } from "react";
import { type TGeheimwoerterQuestionItem } from "./../../../../room/Game/games/Geheimwörter/geheimwörter.types";

export interface IQuestionListProps {
  questions: TGeheimwoerterQuestionItem[];
  setQuestions: Dispatch<SetStateAction<TGeheimwoerterQuestionItem[]>>;
}
