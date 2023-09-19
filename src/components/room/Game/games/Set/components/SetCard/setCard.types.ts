import type { Updater } from "use-immer";
import { type TCardFormList, type TForm } from "./../../set.types";

export interface ISetCardProps {
  editable?: boolean;
  card: TCardFormList;
  setCards?: Updater<TCardFormList[]>;
}
