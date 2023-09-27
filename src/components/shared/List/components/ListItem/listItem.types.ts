export type IListItem = {
  id: string;
  [key: string]: unknown;
};

export interface IListItemProps {
  item: IListItem;
  editable: boolean;
  selected?: boolean;
  onDelete?: () => void;
  onClick?: (itemId: string) => void;
  content?: string;
}
