import type { Icon } from "@tabler/icons-react";

export interface ICardProps {
  Icon?: Icon;
  title: string;
  subTitle?: string;
  onClick?: () => void;
  disabled?: boolean;
}
