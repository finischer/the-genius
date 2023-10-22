import type { Updater } from "use-immer";
import type { TQuestionFormMode } from "~/components/gameshows/types";
import type { TSetQuestionItem } from "~/components/room/Game/games/Set/set.types";

export interface ICreateSetContainerProps {
  question: TSetQuestionItem;
  setQuestion: Updater<TSetQuestionItem>;
}
