export type TArrowDirection = "up" | "right" | "down" | "left";

export interface IArrowActionButtonProps {
  tooltip?: string;
  onClick: () => void;
  arrowDirection: TArrowDirection;
  disabled?: boolean;
}
