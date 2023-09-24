import type { Updater } from "use-immer";
import {
  type TSetCard,
  type TSetGameMarkedCardsState,
  type TSetQuestionItem,
  type TSetQuestionList,
} from "./../../set.types";

export interface ISetCardProps {
  editable?: boolean;
  card: TSetCard;
  index: number;
  isFlipped?: boolean;
  marked?: boolean;
  markerState?: TSetGameMarkedCardsState;
  setCards?: Updater<TSetQuestionItem>;
  onClick?: (cardIndex: number) => void;
}
