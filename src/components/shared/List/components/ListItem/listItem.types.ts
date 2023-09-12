export type IListItem = {
  id: string;
  [key: string]: any;
};

export interface IListItemProps {
  item: IListItem;
  editable: boolean;
  renderValueByKey: keyof IListItem;
}
