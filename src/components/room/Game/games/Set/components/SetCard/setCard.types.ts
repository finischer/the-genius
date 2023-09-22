import type { Updater } from "use-immer";
import { type TCardFormList, type TForm } from "./../../set.types";

export interface ISetCardProps {
  editable?: boolean;
  card: TCardFormList;
  index: number;
  isFlipped?: boolean;
  setCards?: Updater<TCardFormList[]>;
}
