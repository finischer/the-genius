import type { Updater } from "use-immer";
import {
  type TForm,
  type TSetCard,
  type TSetQuestionItem,
  type TSetQuestionList,
} from "./../../set.types";

export interface ISetCardProps {
  editable?: boolean;
  card: TSetCard;
  index: number;
  isFlipped?: boolean;
  setCards?: Updater<TSetQuestionItem>;
}
