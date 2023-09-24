interface HasId {
  id: string | number;
}

export type IListItem = HasId & { [key: string]: string };

export interface IListItemProps {
  item: IListItem;
  editable: boolean;
  selected?: boolean;
  onDelete?: () => void;
  onClick?: (itemId: string) => void;
  content?: string;
}
