import type { Updater } from "use-immer";
import type { TSetQuestionItem } from "~/games/Set/set.types";

export interface ICreateSetContainerProps {
  question: TSetQuestionItem;
  setQuestion: Updater<TSetQuestionItem>;
}
