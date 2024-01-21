import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { IListItem } from "./components/ListItem/listItem.types";

export interface IListProps<T> {
  editable?: boolean;
  deletableItems?: boolean;
  onClickItem?: (item: IListItem<T>) => void;
  onDeleteItem?: (item: IListItem<T> | undefined) => void;
  data: IListItem<T>[];
  selectedItemId?: string;
  setData: Dispatch<SetStateAction<IListItem<T>[]>>;
  renderValueByKey?: keyof T;
  listItem?: ReactNode[] | string[];
  emptyListText?: string;
  itemName?: string; // how the item should be called in the list
  showIndex?: boolean;
  clickable?: boolean;
}
