import type { Dispatch, SetStateAction } from "react";
import type { IListItem } from "./components/ListItem/listItem.types";

export interface IListProps {
  editable?: boolean;
  onClickItem?: (item: IListItem) => void;
  onDeleteItem?: () => void;
  data: IListItem[];
  setData: Dispatch<SetStateAction<any>>;
  renderValueByKey: keyof IListItem;
}
