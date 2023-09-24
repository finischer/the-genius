import type { Dispatch, SetStateAction } from "react";
import type { Updater } from "use-immer";
import type {
  TSetQuestionItem,
  TSetQuestionList,
} from "~/components/room/Game/games/Set/set.types";

export interface ISetListProps {
  questions: TSetQuestionList;
  setQuestions: Dispatch<SetStateAction<TSetQuestionList>>;
  questionItem: TSetQuestionItem;
  setQuestionItem: Updater<TSetQuestionItem>;
}
