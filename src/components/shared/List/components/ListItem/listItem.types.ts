export type IListItem = {
  id: string | number;
  [key: string]: any;
};

export interface IListItemProps {
  item: IListItem;
  editable: boolean;
  renderValueByKey: keyof IListItem;
  selected?: boolean;
  onDelete?: () => void;
  onClick?: (itemId: string) => void;
}
