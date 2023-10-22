import type { Dispatch, SetStateAction } from "react";
import type { IListItem } from "./components/ListItem/listItem.types";

export interface IListProps<T> {
  editable?: boolean;
  onClickItem?: (item: IListItem<T>) => void;
  onDeleteItem?: () => void;
  data: IListItem<T>[];
  selectedItemId?: string;
  setData: Dispatch<SetStateAction<IListItem<T>[]>>;
  renderValueByKey?: keyof T;
  emptyListText?: string;
  itemName?: string; // how the item should be called in the list
}
