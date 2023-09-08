export interface IListProps {
  draggable?: boolean;
  onClickItem?: () => void;
  onDeleteItem?: () => void;
  data: string[];
}
