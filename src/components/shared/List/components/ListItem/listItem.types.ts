export type IListItem<T = Record<string, unknown>> = {
  id: string;
} & T;

export interface IListItemProps<T> {
  item: IListItem<T>;
  editable: boolean;
  selected?: boolean;
  onDelete?: () => void;
  onClick?: (itemId: string) => void;
  content?: string;
}
