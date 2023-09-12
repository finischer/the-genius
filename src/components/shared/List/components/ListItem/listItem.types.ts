export type IListItem = {
  id: string;
  [key: string]: any;
};

export interface IListItemProps {
  item: IListItem;
  draggable: boolean;
  renderValueByKey: keyof IListItem;
}
