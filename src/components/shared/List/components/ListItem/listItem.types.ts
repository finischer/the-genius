export type IListItem = {
  id: string | number;
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
