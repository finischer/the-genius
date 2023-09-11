import type { Dispatch, SetStateAction } from "react";

export type IListItem = {
  id: string;
  [key: string]: any;
};

export interface IListProps {
  canReorder?: boolean;
  onClickItem?: () => void;
  onDeleteItem?: () => void;
  data: IListItem[];
  setData: Dispatch<SetStateAction<any>>;
  renderValueByKey: keyof IListItem;
}
